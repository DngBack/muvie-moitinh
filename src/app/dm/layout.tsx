import { DmBodyClass } from '@/components/dm/DmBodyClass';

export const metadata = { title: 'DM — Mối Tình Đẫm Máu' };

export default function DmLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DmBodyClass />
      <div className="min-h-[100dvh] bg-white text-[var(--dm-ink)]">{children}</div>
    </>
  );
}
