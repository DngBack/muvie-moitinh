'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Scene } from '../Scene';
import { CHARACTERS } from '@/content/characters';
import { isOnline } from '@/lib/types';

type SeatState = 'free' | 'online' | 'away';

/**
 * Màn vào game duy nhất: nhập mã phòng (DM gửi) + chọn nhân vật.
 * Vào lại (đổi máy, xóa trình duyệt…) cũng chỉ cần làm y như vậy.
 */
export function JoinScreen({
  client, initialCode, initialSlot, error, busy, onSubmit,
}: {
  client?: SupabaseClient | null;
  initialCode?: string;
  initialSlot?: number | null;
  error?: string | null;
  busy?: boolean;
  onSubmit: (code: string, slot: number) => void;
}) {
  const [code, setCode] = useState(initialCode ?? '');
  const [slot, setSlot] = useState<number | null>(initialSlot ?? null);
  const [seats, setSeats] = useState<Record<number, SeatState> | null>(null);
  const [roomMissing, setRoomMissing] = useState(false);

  // Mã đủ 8 số → xem vai nào đang có người (để người chơi khỏi chọn nhầm)
  useEffect(() => {
    setSeats(null);
    setRoomMissing(false);
    if (code.length !== 8 || !client) return;
    let off = false;
    (async () => {
      const { data: room } = await client.from('rooms').select('id, closed_at').eq('invite_code', code).maybeSingle();
      if (off) return;
      if (!room || room.closed_at) { setRoomMissing(true); return; }
      const { data } = await client.from('room_players').select('slot, holder, last_seen').eq('room_id', room.id);
      if (off) return;
      const map: Record<number, SeatState> = {};
      for (const p of data ?? []) map[p.slot] = !p.holder ? 'free' : isOnline(p.last_seen) ? 'online' : 'away';
      setSeats(map);
    })();
    return () => { off = true; };
  }, [client, code]);

  const picked = slot ? CHARACTERS.find((c) => c.slot === slot) : null;
  const pickedState = slot && seats ? seats[slot] ?? 'free' : 'free';

  return (
    <main className="qq-screen">
      <Scene scene="login" />
      <form
        className="qq-inner mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]"
        onSubmit={(e) => { e.preventDefault(); if (code.length === 8 && slot) onSubmit(code, slot); }}
      >
        <p className="qq-pixel text-base tracking-widest text-[var(--qq-mute)]">THIÊN HY NIÊN 2.0</p>
        <h1 className="brush-title mt-1 text-4xl leading-tight">Mối Tình Đẫm Máu</h1>

        <label htmlFor="invite" className="qq-title mt-8 block text-lg">/Vui lòng nhập mã khóa lời mời:</label>
        <input
          id="invite"
          className="qq-input qq-pixel mt-3 text-center text-3xl tracking-[0.4em]"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={8}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
          placeholder="••••••••"
        />
        {roomMissing && <p className="mt-2 text-sm text-red-300">Không tìm thấy phòng với mã này (hoặc đã đóng). Hỏi lại người dẫn trò.</p>}

        <p className="qq-title mt-7 text-lg">/Chọn nhân vật của bạn:</p>
        <p className="mt-1 text-xs text-[var(--qq-mute)]">Biệt danh in trên trang đầu cuốn kịch bản của bạn.</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {CHARACTERS.map((c) => {
            const st = seats?.[c.slot] ?? 'free';
            const on = slot === c.slot;
            return (
              <button
                key={c.slot}
                type="button"
                onClick={() => setSlot(c.slot)}
                className={`rounded border px-3 py-3 text-left transition ${on ? 'border-white/80 bg-white/15' : 'border-white/15 bg-white/5 active:bg-white/10'}`}
              >
                <span className="flex items-center justify-between text-[11px] text-[var(--qq-mute)]">
                  Thư mời số {c.slot}
                  {seats && st !== 'free' && (
                    <span className={`h-2 w-2 rounded-full ${st === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={st === 'online' ? 'Đang có người chơi' : 'Đã vào, đang thoát ra'} />
                  )}
                </span>
                <span className="mt-1 block font-bold" style={{ color: c.color }}>[{c.nick}]</span>
              </button>
            );
          })}
        </div>
        {picked && pickedState !== 'free' && (
          <p className="mt-3 rounded bg-amber-900/50 px-3 py-2 text-xs text-amber-100">
            [{picked.nick}] đã có người vào. Nếu đó là bạn (đổi máy / lỡ thoát) thì cứ bấm Vào — tiến độ được giữ nguyên, máy cũ sẽ tự thoát.
          </p>
        )}

        {error && <p className="mt-3 rounded bg-red-900/60 px-3 py-2 text-sm text-red-100">{error}</p>}
        <p className="mt-4 text-xs text-white/60">🔊 Nhớ bật âm thanh điện thoại. Không lật đọc kịch bản khi chưa được hướng dẫn.</p>

        <div className="mt-6 flex justify-center">
          <button type="submit" className="btn-green" disabled={busy || code.length < 8 || !slot}>
            {busy ? 'Đang vào…' : 'Vào'}
          </button>
        </div>

        <Link href="/dm" className="mt-auto pt-10 text-center text-xs text-white/40 underline underline-offset-4">Người dẫn trò (DM)</Link>
      </form>
    </main>
  );
}
