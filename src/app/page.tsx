import Link from 'next/link';
import { CHARACTERS } from '@/content/characters';

export default function Home() {
  return (
    <main className="qq-screen">
      <div className="qq-inner mx-auto flex min-h-[100dvh] max-w-md flex-col px-5 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))]">
        <p className="qq-pixel text-lg tracking-widest text-[var(--qq-mute)]">THIÊN HY NIÊN 2.0</p>
        <h1 className="brush-title mt-2 text-5xl leading-tight">Mối Tình Đẫm Máu</h1>
        <p className="mt-1 text-sm text-[var(--qq-mute)]">血腥爱情故事</p>

        <section className="mt-10">
          <h2 className="qq-title text-xl">Người chơi — chọn vai của bạn</h2>
          <p className="mt-1 text-sm text-[var(--qq-mute)]">Thường bạn sẽ vào bằng mã QR ở trang đầu kịch bản.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {CHARACTERS.map((c) => (
              <Link
                key={c.slot}
                href={`/p/${c.slot}`}
                className="rounded border border-white/15 bg-white/5 px-3 py-3 transition hover:bg-white/10"
              >
                <span className="text-xs text-[var(--qq-mute)]">Thư mời số {c.slot}</span>
                <span className="mt-1 block font-bold" style={{ color: c.color }}>[{c.nick}]</span>
              </Link>
            ))}
          </div>
          <Link href="/p" className="mt-3 block text-center text-sm text-[var(--qq-mute)] underline underline-offset-4">
            Quay lại vai đang chơi trên thiết bị này
          </Link>
        </section>

        <section className="mt-auto pt-12">
          <Link href="/dm" className="btn-stone w-full">Người dẫn trò (DM)</Link>
        </section>
      </div>
    </main>
  );
}
