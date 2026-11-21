'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Scene } from '../Scene';
import type { Character } from '@/content/characters';

export function InviteKeyScreen({
  character, initialCode, error, busy, bgUrl, onSubmit,
}: {
  character: Character;
  initialCode?: string;
  error?: string | null;
  busy?: boolean;
  bgUrl?: string | null;
  onSubmit: (code: string) => void;
}) {
  const [code, setCode] = useState(initialCode ?? '');
  return (
    <main className="qq-screen">
      <Scene scene="login" imageUrl={bgUrl} />
      <form
        className="qq-inner mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]"
        onSubmit={(e) => { e.preventDefault(); if (code.trim()) onSubmit(code.trim()); }}
      >
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Thư mời số {character.slot}</span>
          <span className="font-bold" style={{ color: character.color }}>[{character.nick}]</span>
        </div>

        <div className="mt-auto">
          <label htmlFor="invite" className="qq-title block text-lg">/Vui lòng nhập mã khóa lời mời:</label>
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
          {error && <p className="mt-3 rounded bg-red-900/60 px-3 py-2 text-sm text-red-100">{error}</p>}
          <p className="mt-3 text-xs text-white/60">🔊 Nhớ bật âm thanh điện thoại. Không lật đọc kịch bản khi chưa được hướng dẫn.</p>
          <div className="mt-8 flex justify-center">
            <button type="submit" className="btn-green" disabled={busy || code.length < 8}>
              {busy ? 'Đang vào…' : 'Vào'}
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-white/50">
            Không phải vai này? <Link href="/" className="underline">Chọn vai khác</Link>
          </p>
        </div>
      </form>
    </main>
  );
}
