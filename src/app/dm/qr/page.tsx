'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CHARACTERS } from '@/content/characters';

interface Item { title: string; sub: string; caption: string; url: string; color: string; img?: string }

/** Trang in mã QR: dán vào trang đầu mỗi kịch bản và vào “Thư của Hoan Hoan”. */
export default function QrSheet() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const origin = window.location.origin;
    const list: Item[] = [
      ...CHARACTERS.map((c) => ({
        title: `[${c.nick}]`, sub: `Thư mời số ${c.slot} — trang đầu kịch bản`, caption: 'Quét mã để đăng nhập phòng chat OICQ',
        url: `${origin}/p/${c.slot}`, color: c.color,
      })),
      { title: 'Thư của Hoan Hoan', sub: 'Trang cuối thư (dùng chung cho 6 cuốn)', caption: 'Quét mã để vào lượt chơi thứ ba', url: `${origin}/p`, color: '#c9a0ff' },
    ];
    Promise.all(list.map(async (it) => ({ ...it, img: await QRCode.toDataURL(it.url, { margin: 1, width: 480, errorCorrectionLevel: 'M' }) }))).then(setItems);
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <div className="no-print mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold">Mã QR in kèm kịch bản</h1>
        <button onClick={() => window.print()} className="ml-auto rounded-lg bg-[var(--dm-pink)] px-4 py-2 font-semibold text-white">In trang này</button>
        <p className="w-full text-sm text-[var(--dm-mute)]">Mã QR cố định theo tên miền — chỉ cần in một lần, dùng cho mọi lượt chơi. Nếu đổi tên miền, hãy in lại.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.url} className="break-inside-avoid rounded-xl border border-[var(--dm-line)] p-4 text-center">
            <p className="font-bold" style={{ color: it.color === '#f2c46d' ? '#b98a1e' : it.color }}>{it.title}</p>
            <p className="text-xs text-[var(--dm-mute)]">{it.sub}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {it.img && <img src={it.img} alt={`QR ${it.title}`} className="mx-auto mt-3 w-full max-w-[200px]" />}
            <p className="mt-2 text-sm font-semibold">{it.caption}</p>
            <p className="mt-1 break-all font-mono text-[10px] text-[var(--dm-mute)]">{it.url}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
