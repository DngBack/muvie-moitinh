'use client';

export function DmShellMessage({ title, sub, spin = true, children }: { title: string; sub?: string; spin?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-6 text-center text-[var(--dm-ink)]">
      {spin && <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-[var(--dm-pink)]" />}
      <p className="mt-4 font-semibold">{title}</p>
      {sub && <p className="mt-2 max-w-sm text-sm text-[var(--dm-mute)]">{sub}</p>}
      {children}
    </div>
  );
}

export const NOT_CONFIGURED = {
  title: 'Chưa cấu hình Supabase',
  sub: 'Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào biến môi trường rồi deploy lại.',
};
