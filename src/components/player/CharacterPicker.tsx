'use client';
import { CHARACTERS } from '@/content/characters';

export function CharacterPicker({ onPick }: { onPick: (slot: number) => void }) {
  return (
    <main className="qq-screen">
      <div className="qq-inner mx-auto max-w-md px-6 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))]">
        <h1 className="qq-title text-2xl">Bạn đang giữ thư mời số mấy?</h1>
        <p className="mt-2 text-sm text-[var(--qq-mute)]">Chọn đúng biệt danh in trên kịch bản của bạn.</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {CHARACTERS.map((c) => (
            <button key={c.slot} onClick={() => onPick(c.slot)} className="rounded border border-white/15 bg-white/5 px-3 py-4 text-left active:bg-white/10">
              <span className="text-xs text-[var(--qq-mute)]">Thư mời số {c.slot}</span>
              <span className="mt-1 block font-bold" style={{ color: c.color }}>[{c.nick}]</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
