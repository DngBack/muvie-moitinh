'use client';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { dmClient, supabaseConfigured } from '@/lib/supabase';

export function useDmSession() {
  const client = useMemo(() => (supabaseConfigured ? dmClient() : null), []);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!client) { setLoading(false); return; }
    const pick = (u: User | null | undefined) => (u && !u.is_anonymous ? u : null);
    client.auth.getSession().then(({ data }) => { setUser(pick(data.session?.user)); setLoading(false); });
    const { data: sub } = client.auth.onAuthStateChange((_e, s) => { setUser(pick(s?.user)); setLoading(false); });
    return () => sub.subscription.unsubscribe();
  }, [client]);

  return { client, user, loading };
}

/** Bọc các trang DM: chưa đăng nhập → chuyển sang /dm/login (giữ lại trang đang mở để quay về). */
export function DmGuard({ children }: { children: (ctx: { user: User }) => React.ReactNode }) {
  const { user, loading, client } = useDmSession();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (!loading && !user && client) router.replace(`/dm/login?next=${encodeURIComponent(path)}`);
  }, [loading, user, client, router, path]);

  if (!client) return <DmShellMessage title="Chưa cấu hình Supabase" sub="Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào biến môi trường rồi deploy lại." />;
  if (loading || !user) return <DmShellMessage title="Đang kiểm tra đăng nhập…" />;
  return <>{children({ user })}</>;
}

export function DmShellMessage({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-6 text-center text-[var(--dm-ink)]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-[var(--dm-pink)]" />
      <p className="mt-4 font-semibold">{title}</p>
      {sub && <p className="mt-2 max-w-sm text-sm text-[var(--dm-mute)]">{sub}</p>}
    </div>
  );
}
