'use client';

/** Khung popup kiểu game (đầu ổ khóa, nút ✖ vàng) */
export function GameModal({
  title, onClose, children, shake,
}: { title: string; onClose?: () => void; children: React.ReactNode; shake?: boolean }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/55 px-4">
      <div className={`qq-modal w-full max-w-md fade-in ${shake ? 'shake' : ''}`}>
        <div className="qq-modal-head">
          <LockIcon />
          <h2 className="flex-1 text-lg font-extrabold tracking-wide text-white">{title}</h2>
          {onClose && <button aria-label="Đóng" onClick={onClose} className="qq-x px-1">✖</button>}
        </div>
        <div className="relative space-y-3 px-4 pb-5 pt-4 text-[0.95rem]">{children}</div>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <path d="M8 13 V9 a7 7 0 0 1 14 0 V13" fill="none" stroke="#e9d9a0" strokeWidth="3" />
      <rect x="4" y="13" width="22" height="15" rx="2" fill="#f2b33d" stroke="#8a5a10" strokeWidth="1.5" />
      <rect x="4" y="13" width="22" height="5" fill="#ffd36a" />
    </svg>
  );
}
