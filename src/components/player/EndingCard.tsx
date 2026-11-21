'use client';
import { useRef, useState } from 'react';
import { Scene } from '../Scene';
import { Nick } from './ChatRoom';
import { ENDINGS, DEFAULT_CUSTOM_LINE } from '@/content/endings';
import { charBySlot } from '@/content/characters';
import type { Ending } from '@/lib/types';

/** Màn hình kết cục — người chơi sửa dòng chữ kỷ niệm và lưu thành ảnh. */
export function EndingCard({
  ending, slot, customLine, bgUrl, onSaveLine,
}: {
  ending: Ending;
  slot: number;
  customLine?: string;
  bgUrl?: string | null;
  onSaveLine: (s: string) => void;
}) {
  const e = ENDINGS[ending];
  const c = charBySlot(slot);
  const [line, setLine] = useState(customLine || DEFAULT_CUSTOM_LINE);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const card = useRef<HTMLDivElement>(null);

  async function save() {
    if (!card.current) return;
    setBusy(true);
    setMsg(null);
    try {
      const { toPng } = await import('html-to-image');
      const url = await toPng(card.current, { pixelRatio: 2, cacheBust: true, filter: (n) => !(n instanceof HTMLElement && n.dataset.noexport === '1') });
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], `moi-tinh-dam-mau-${c.nick}.png`, { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: 'Mối Tình Đẫm Máu' });
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        setMsg('Đã tải ảnh xuống. Trên iPhone: nhấn giữ ảnh để lưu.');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setMsg('Không lưu được ảnh — hãy chụp màn hình nhé.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="qq-screen">
      <div ref={card} className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col overflow-hidden bg-[#141018]">
        <Scene scene={ending === 'continue' ? 'room' : 'void'} imageUrl={bgUrl} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        <div className="relative z-10 flex flex-1 flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
          <div className="text-center">
            <h1 className="brush-title text-[3.1rem] leading-none" style={{ transform: 'rotate(-4deg)' }}>Mối Tình Đẫm Máu</h1>
            <p className="mt-2 text-xs tracking-[0.4em] text-[#e9d7a8]/70">血腥爱情故事</p>
          </div>

          <div className="mt-8 rounded bg-black/45 p-4 text-[0.93rem] leading-relaxed text-white/90 backdrop-blur-[2px]">
            <p className="mb-2 font-bold text-[#ffb6cf]">{e.title}</p>
            {e.text.map((t, i) => <p key={i} className="mb-2">{t}</p>)}
            <p className="mt-3 border-l-2 border-[#ff6b9a] pl-3 italic">“{e.quote}”</p>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2" data-noexport="1">
            <button className="btn-green" onClick={save} disabled={busy}>{busy ? 'Đang lưu…' : 'Lưu'}</button>
            {msg && <p className="rounded bg-black/70 px-3 py-1 text-xs">{msg}</p>}
          </div>

          <div className="mt-auto pt-6">
            <p className="text-lg"><Nick nick={c.nick} /></p>
            {editing ? (
              <input
                data-noexport="1"
                className="qq-input mt-2 text-xl"
                value={line}
                maxLength={60}
                autoFocus
                onChange={(ev) => setLine(ev.target.value)}
                onBlur={() => { setEditing(false); onSaveLine(line); }}
                onKeyDown={(ev) => { if (ev.key === 'Enter') (ev.target as HTMLInputElement).blur(); }}
              />
            ) : (
              <button onClick={() => setEditing(true)} className="mt-1 block w-full text-left">
                <span className="brush-title text-3xl text-[#ffd3e2]">{line}</span>
                <span data-noexport="1" className="ml-2 align-middle text-xs text-white/50">✎ sửa</span>
              </button>
            )}
            <p className="mt-4 text-[10px] tracking-widest text-white/40">THIÊN HY NIÊN 2.0 · CẢM ƠN BẠN ĐÃ THAM GIA</p>
          </div>
        </div>
      </div>
    </main>
  );
}
