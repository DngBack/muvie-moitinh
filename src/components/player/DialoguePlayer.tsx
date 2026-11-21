'use client';
import { useEffect, useRef, useState } from 'react';
import { Scene } from '../Scene';
import type { Line, SceneKey } from '@/content/interfaces';

export function GlitchHeader({ kind }: { kind: 'warn' | 'error' }) {
  const text = kind === 'warn' ? '⚠ Cảnh báo: NPC thức tỉnh ý thức, cốt truyện đi chệch hướng' : '✖ Error — Cốt truyện đi chệch hướng';
  return (
    <div className={`glitch-band ${kind === 'error' ? 'error' : ''} relative z-20 px-4 pb-2 pt-[max(0.6rem,env(safe-area-inset-top))] text-center text-sm font-bold tracking-wide`}>
      <span className={`glitch-text ${kind === 'error' ? 'text-red-300' : 'text-pink-100'}`} data-text={text}>{text}</span>
    </div>
  );
}

/**
 * Hội thoại kiểu visual novel: ảnh nền + hộp thoại dưới, chạm để tiếp tục.
 * Lưu vị trí dòng (onLine) để người chơi thoát ra/vào lại vẫn đọc tiếp đúng chỗ.
 */
export function DialoguePlayer({
  lines, start = 0, scene, bgUrl, header, onLine, onDone, title,
}: {
  lines: Line[];
  start?: number;
  scene: SceneKey;
  bgUrl?: string | null;
  header?: 'warn' | 'error';
  title?: string;
  onLine?: (i: number) => void;
  onDone: () => void;
}) {
  const [idx, setIdx] = useState(Math.min(Math.max(start, 0), Math.max(lines.length - 1, 0)));
  const [chars, setChars] = useState(0);
  const line = lines[idx];
  const full = line?.text ?? '';
  const typing = chars < full.length;
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setChars(0);
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setChars((c) => {
        if (c >= full.length) {
          if (timer.current) window.clearInterval(timer.current);
          return c;
        }
        return c + 2;
      });
    }, 28);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [idx, full]);

  function next() {
    if (typing) { setChars(full.length); return; }
    if (idx < lines.length - 1) {
      const n = idx + 1;
      setIdx(n);
      onLine?.(n);
    } else {
      onDone();
    }
  }
  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    if (idx > 0) setIdx(idx - 1);
  }

  if (!line) return null;
  const glitchy = line.kind === 'glitch' || header === 'error';

  return (
    <main className="qq-screen select-none" onClick={next}>
      <Scene scene={scene} imageUrl={bgUrl} />
      {header && <div className="absolute inset-0 scanlines" />}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {header && <GlitchHeader kind={header} />}
        <div className="flex items-center justify-between px-4 pt-3 text-xs text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,.8)]">
          <button onClick={prev} className="rounded bg-black/30 px-2 py-1 disabled:opacity-30" disabled={idx === 0}>‹ Trước</button>
          {title && <span className="truncate px-2">{title}</span>}
          <span className="qq-pixel text-base">{idx + 1}/{lines.length}</span>
        </div>

        <div className="mt-auto">
          <div className="vn-box mx-auto max-w-md px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
            {line.who && (
              <div className="mb-2">
                <span className={`vn-name ${line.kind === 'system' ? 'qq-pixel text-lg !border-cyan-300 text-cyan-200' : ''}`}>{line.who}</span>
              </div>
            )}
            <p
              className={[
                'min-h-[5.5em] text-[1.04rem] leading-relaxed',
                line.kind === 'narration' ? 'italic text-white/90' : '',
                line.kind === 'system' ? 'qq-pixel text-xl text-cyan-100' : '',
                glitchy && line.kind === 'glitch' ? 'text-pink-100 rgb-split' : '',
              ].join(' ')}
            >
              {full.slice(0, chars)}
            </p>
            <p className={`mt-2 text-center text-sm text-white/70 ${typing ? 'invisible' : ''}`}>
              <span className="vn-caret inline-block text-emerald-300">▼</span>{' '}
              {idx < lines.length - 1 ? 'Nhấn để tiếp tục' : 'Nhấn để kết thúc'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
