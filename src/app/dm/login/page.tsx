'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDmSession } from '@/components/dm/useDmSession';

function LoginInner() {
  const { client, user, loading } = useDmSession();
  const router = useRouter();
  const next = useSearchParams().get('next') || '/dm';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace(next.startsWith('/dm') ? next : '/dm');
  }, [loading, user, router, next]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!client) return;
    setBusy(true);
    setErr(null);
    const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setErr(error.message === 'Invalid login credentials' ? 'Sai email hoặc mật khẩu.' : error.message);
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-center px-6">
      <p className="text-sm text-[var(--dm-mute)]">Thiên Hy Niên 2.0</p>
      <h1 className="mt-1 text-2xl font-bold">Đăng nhập người dẫn trò</h1>
      <div className="dm-bar mt-4 h-1.5 w-16 rounded" />
      {!client && <p className="mt-6 rounded bg-amber-50 p-3 text-sm text-amber-800">Chưa cấu hình Supabase — xem README.</p>}
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold">Email</span>
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--dm-line)] px-3 py-2.5 outline-none focus:border-[var(--dm-pink)]" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Mật khẩu</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--dm-line)] px-3 py-2.5 outline-none focus:border-[var(--dm-pink)]" />
        </label>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={busy || !client} className="w-full rounded-lg bg-[var(--dm-pink)] py-3 font-semibold text-white disabled:opacity-60">
          {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>
      <p className="mt-6 text-xs leading-relaxed text-[var(--dm-mute)]">
        Tài khoản DM do chủ quán tạo trong Supabase (Authentication → Users → Add user). Đăng nhập một lần là thiết bị sẽ nhớ — thoát trình duyệt rồi mở lại vẫn vào thẳng lượt chơi đang dẫn.
      </p>
    </main>
  );
}

export default function DmLogin() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
