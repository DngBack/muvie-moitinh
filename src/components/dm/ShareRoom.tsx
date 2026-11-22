'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/** Gửi mã phòng cho người chơi: đọc mã, chia sẻ link (Zalo/Messenger…), hoặc cho quét QR. */
export function ShareRoom({ code, compact }: { code: string; compact?: boolean }) {
  const [link, setLink] = useState('');
  const [qr, setQr] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(!compact);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    const url = `${window.location.origin}/?code=${code}`;
    setLink(url);
    QRCode.toDataURL(url, { margin: 1, width: 360, errorCorrectionLevel: 'M' }).then(setQr).catch(() => {});
  }, [code]);

  const text = `Mối Tình Đẫm Máu — mã phòng: ${code}\nVào ${link} rồi chọn nhân vật của bạn.`;

  async function share() {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try { await nav.share({ title: 'Mối Tình Đẫm Máu', text, url: link }); return; } catch { /* người dùng hủy → thử chép */ }
    }
    try { await navigator.clipboard.writeText(text); setNote('Đã chép lời mời — dán vào nhóm chat'); }
    catch { setNote('Không chép được, hãy đọc mã cho người chơi'); }
    window.setTimeout(() => setNote(null), 2500);
  }

  return (
    <div className="dm-card px-4 py-4 text-center">
      <p className="text-xs text-[var(--dm-mute)]">Mã phòng — gửi cho người chơi</p>
      <p className="mt-1 font-mono text-4xl font-bold tracking-[0.2em] text-[var(--dm-pink)]">{code}</p>
      <p className="mt-1 break-all text-xs text-[var(--dm-mute)]">Người chơi mở <b>{link.replace(/^https?:\/\//, '').replace(/\/\?code=.*/, '')}</b> → nhập mã → chọn nhân vật</p>
      <div className="mt-3 flex justify-center gap-2">
        <button onClick={share} className="rounded-lg bg-[var(--dm-pink)] px-4 py-2 text-sm font-semibold text-white">Chia sẻ lời mời</button>
        <button onClick={() => setShowQr((s) => !s)} className="rounded-lg border border-[var(--dm-line)] px-4 py-2 text-sm">{showQr ? 'Ẩn QR' : 'Hiện QR'}</button>
      </div>
      {note && <p className="mt-2 text-xs text-emerald-600">{note}</p>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {showQr && qr && <img src={qr} alt={`QR vào phòng ${code}`} className="mx-auto mt-3 w-full max-w-[220px]" />}
      {showQr && <p className="text-xs text-[var(--dm-mute)]">Quét QR → mã tự điền sẵn, chỉ cần chọn nhân vật.</p>}
    </div>
  );
}
