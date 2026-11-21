'use client';
import { useState } from 'react';
import { GameModal } from './GameModal';
import { checkAnswer } from '@/lib/check';
import { GATES } from '@/content/interfaces';

/** Cổng nhập đáp án ở Giao diện 4 (nơi giấu đầu) và 5 (hung khí), có gợi ý nhẹ sau mỗi lần sai. */
export function AnswerGate({
  kind, attempts, onWrong, onOk,
}: { kind: 'head' | 'weapon'; attempts: number; onWrong: () => void; onOk: () => void }) {
  const g = GATES[kind];
  const [val, setVal] = useState('');
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [ok, setOk] = useState(false);

  async function submit() {
    if (!val.trim() || busy) return;
    setBusy(true);
    setWrong(false);
    try {
      const r = await checkAnswer({ kind, answer: val });
      if (r.ok) {
        setOk(true);
        navigator.vibrate?.([60, 40, 60]);
        window.setTimeout(onOk, 1200);
      } else {
        setWrong(true);
        onWrong();
        navigator.vibrate?.(120);
      }
    } catch {
      setWrong(true);
    } finally {
      setBusy(false);
    }
  }

  const hint = attempts >= 1 ? g.hints[Math.min(attempts - 1, g.hints.length - 1)] : null;

  return (
    <GameModal title="Nhiệm vụ của hệ thống" shake={wrong}>
      <p className="text-lg font-bold">{g.question}</p>
      {!ok ? (
        <>
          <input
            className="qq-input"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoComplete="off"
            placeholder="Nhập đáp án…"
          />
          {wrong && <p className="text-sm text-red-300">Đáp án chưa đúng.</p>}
          {hint && <p className="rounded bg-black/30 px-3 py-2 text-sm text-amber-200">{hint}</p>}
          <p className="text-xs text-white/55">Hãy thảo luận với mọi người — người dẫn trò cũng sẽ hỏi đáp án này.</p>
          <div className="flex justify-center pt-1">
            <button className="btn-stone" onClick={submit} disabled={busy}>
              {busy ? '…' : 'Xác nhận'}
            </button>
          </div>
        </>
      ) : (
        <p className="fade-in rounded border border-emerald-400/50 bg-emerald-900/40 px-3 py-3 text-center font-bold text-emerald-200">
          Chính xác.
        </p>
      )}
    </GameModal>
  );
}
