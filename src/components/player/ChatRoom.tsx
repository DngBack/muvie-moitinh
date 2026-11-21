'use client';
import { useEffect, useRef, useState } from 'react';
import { CHAT_LOGS, chatTail, type ChatEntry } from '@/content/chatLogs';
import { charBySlot, colorOfNick } from '@/content/characters';
import { Scene } from '../Scene';

function Dot({ color }: { color: string }) {
  return (
    <span
      className="mx-0.5 inline-block h-[0.95em] w-[0.95em] translate-y-[0.12em] rounded-full"
      style={{ background: `radial-gradient(circle at 35% 35%, #fff 0 18%, ${color} 22% 55%, #1a1f3a 60% 70%, ${color} 74%)` }}
    />
  );
}

export function Nick({ nick }: { nick: string }) {
  const color = colorOfNick(nick);
  return (
    <span className="whitespace-nowrap font-semibold" style={{ color }}>
      [{nick}]<Dot color={color} />
    </span>
  );
}

function renderSys(text: string) {
  const m = text.match(/^\[(.+?)\] (.*)$/);
  if (!m) return text;
  return (<><Nick nick={m[1]} /> {m[2]}</>);
}

/** Phòng chat OICQ "Tinh Anh Thiên Hy" */
export function ChatRoom({
  slot, onlineCount, bgUrl, children, onOpenDiary, diaryLabel = 'Nhấn để xem nhật ký', instant,
}: {
  slot: number;
  instant?: boolean;
  onlineCount: number;
  bgUrl?: string | null;
  onOpenDiary: () => void;
  diaryLabel?: string;
  children?: React.ReactNode;
}) {
  const me = charBySlot(slot);
  const entries: ChatEntry[] = [...(CHAT_LOGS[slot] ?? []), ...chatTail(me.nick)];
  const diaryIndex = entries.findIndex((e) => e.t === 'sys' && e.text.startsWith('Hệ thống nhật ký'));
  const [shown, setShown] = useState(instant ? Number.MAX_SAFE_INTEGER : 0);
  const bottom = useRef<HTMLDivElement>(null);

  // Tin nhắn hiện dần từ trên xuống như đang lướt lại lịch sử chat
  useEffect(() => {
    if (shown >= entries.length) return;
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 400 : 650);
    return () => window.clearTimeout(t);
  }, [shown, entries.length]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'end' });
  }, [shown, instant]);

  return (
    <main className="qq-screen">
      <Scene scene="chat" imageUrl={bgUrl} className="opacity-50" />
      <div className="qq-inner mx-auto flex min-h-[100dvh] max-w-md flex-col px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <h1 className="qq-title text-[1.65rem]">Chào mừng đến với <span className="hl">Tinh Anh Thiên Hy</span></h1>
        <p className="qq-online mt-4 text-xl">Hiện có {Math.max(onlineCount, 1)} người trực tuyến</p>

        <div
          className="mt-5 flex-1 space-y-4 pb-28 text-[1.02rem] leading-relaxed"
          onClick={() => setShown((n) => (n < entries.length ? entries.length : n))}
        >
          {entries.slice(0, shown).map((e, i) => (
            <div key={i} className="fade-in">
              {e.t === 'msg' && (
                <p><Nick nick={e.who} />:{' '}<span className="text-[var(--qq-text)]">{e.text}</span></p>
              )}
              {e.t === 'time' && <p className="qq-sys text-sm opacity-80">{e.text}</p>}
              {e.t === 'sys' && i !== diaryIndex && <p className="qq-sys">{renderSys(e.text)}</p>}
              {e.t === 'sys' && i === diaryIndex && (
                <div className="flex flex-col items-center gap-4 py-2">
                  <p className="flex items-center gap-2 font-bold"><DocIcon color="#5b6b8e" />{e.text}</p>
                  <button onClick={onOpenDiary} className="relative flex items-center gap-2 font-bold active:opacity-70">
                    <DocIcon color="#6b2337" />{diaryLabel}
                    <span className="tap-hand absolute left-1/2 top-5 text-2xl">👆</span>
                  </button>
                </div>
              )}
            </div>
          ))}
          {shown < entries.length && <p className="qq-sys animate-pulse">…</p>}
          <div ref={bottom} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md bg-gradient-to-t from-[#0b0f1c] via-[#0b0f1c]/90 to-transparent px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6">
        <p className="qq-pixel text-2xl"><Nick nick={me.nick} /> $<span className="ml-1 animate-pulse">▍</span></p>
      </div>
      {children}
    </main>
  );
}

function DocIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="32" viewBox="0 0 26 32" aria-hidden>
      <path d="M2 2 H17 L24 9 V30 H2 Z" fill={color} stroke="#d7def0" strokeWidth="2" />
      <path d="M17 2 V9 H24" fill="#d7def0" opacity=".6" />
      <rect x="4" y="27" width="20" height="3" fill="#000" opacity=".35" />
    </svg>
  );
}
