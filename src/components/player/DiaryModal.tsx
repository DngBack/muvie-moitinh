'use client';
import { useState } from 'react';
import { GameModal } from './GameModal';
import { checkAnswer } from '@/lib/check';
import { CHAT_HINTS } from '@/content/chatLogs';
import { DIARY_HINT_SENTENCE, L2_HINTS, SECURITY_QUESTIONS } from '@/content/security';
import { charBySlot } from '@/content/characters';
import type { Progress } from '@/lib/types';

const TITLE = 'Xác minh mật khẩu riêng của không gian nhật ký';
const INTRO =
  'Theo thiết lập của hệ thống, đăng nhập không gian nhật ký cần xác minh bảo mật. Vui lòng nhập họ tên đã thiết lập cho không gian nhật ký:';

/** Lần 1 — nhập tên lớp 1 (Lượt chơi thứ nhất) */
export function DiaryLoginL1({
  slot, progress, save, onClose,
}: { slot: number; progress: Progress; save: (p: Progress) => void; onClose: () => void }) {
  const [val, setVal] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const attempts = progress.name_attempts ?? 0;

  async function submit() {
    if (!val.trim() || busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await checkAnswer({ kind: 'l1', slot, answer: val });
      if (r.ok) {
        save({ name_ok: true });
      } else {
        save({ name_attempts: attempts + 1 });
        setMsg('Mật khẩu sai.');
        setShake(true);
        window.setTimeout(() => setShake(false), 450);
        navigator.vibrate?.(120);
      }
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const hint = attempts >= 2 ? CHAT_HINTS[Math.min(attempts - 2, CHAT_HINTS.length - 1)] : null;

  return (
    <GameModal title={TITLE} onClose={onClose} shake={shake}>
      <p className="font-semibold leading-snug">{INTRO}</p>
      <input
        className="qq-input"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        autoFocus
        autoComplete="off"
      />
      <p className="opacity-90">{DIARY_HINT_SENTENCE}</p>
      {msg && (
        <p className="text-sm text-red-300">
          {msg}
          {attempts >= 1 ? ' Đừng thử nhập tên bừa bãi — trò chơi có thể bị chấm dứt.' : ''}
        </p>
      )}
      {hint && <p className="rounded bg-black/30 px-3 py-2 text-sm text-amber-200">{hint}</p>}
      <div className="flex justify-center pt-2">
        <button className="btn-stone" onClick={submit} disabled={busy}>
          {busy ? '…' : 'Xác nhận'}
        </button>
      </div>
    </GameModal>
  );
}

/** Lần 2 — Giao diện 2: tên lớp 2 → câu hỏi bảo mật */
export function DiaryLoginL2({
  slot, progress, save, onClose,
}: { slot: number; progress: Progress; save: (p: Progress) => void; onClose: () => void }) {
  const c = charBySlot(slot);
  const [val, setVal] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const attempts = progress.l2_attempts ?? 0;
  const qs = SECURITY_QUESTIONS[slot] ?? [];
  const secOk = [progress.sec_1, progress.sec_2, progress.sec_3, progress.sec_4];
  const allOk = secOk.every(Boolean);

  async function submit() {
    if (!val.trim() || busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await checkAnswer({ kind: 'l2', slot, answer: val });
      if (r.ok) {
        save({ l2_ok: true });
        navigator.vibrate?.([60, 40, 60]);
      } else {
        save({ l2_attempts: attempts + 1 });
        setMsg(r.used ? L2_HINTS[0] : 'Mật khẩu sai.');
        setShake(true);
        window.setTimeout(() => setShake(false), 450);
      }
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const hint = !progress.l2_ok && attempts >= 2 ? L2_HINTS[Math.min(attempts - 1, L2_HINTS.length - 1)] : null;

  return (
    <GameModal title={TITLE} onClose={onClose} shake={shake}>
      <p className="font-semibold leading-snug">{INTRO}</p>
      {!progress.l2_ok ? (
        <>
          <input
            className="qq-input"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoComplete="off"
          />
          <p>{DIARY_HINT_SENTENCE}</p>
          {msg && <p className="text-sm text-red-300">{msg}</p>}
          {hint && <p className="rounded bg-black/30 px-3 py-2 text-sm text-amber-200">{hint}</p>}
          <div className="flex justify-center pt-2">
            <button className="btn-stone" onClick={submit} disabled={busy}>
              {busy ? '…' : 'Xác nhận'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="border border-[#9b6b6b] bg-black/40 px-3 py-2 text-sm text-[#ffb4a8]">
            Mật khẩu sai, đã kích hoạt cơ chế bảo mật mật khẩu, vui lòng trả lời câu hỏi bảo mật
          </p>
          <p>{DIARY_HINT_SENTENCE}</p>
          <div className="space-y-3">
            {qs.map((q, i) => (
              <SecurityRow
                key={i}
                slot={slot}
                index={i + 1}
                question={q}
                ok={!!secOk[i]}
                onOk={() => save({ [`sec_${i + 1}`]: true })}
              />
            ))}
          </div>
          {allOk && (
            <div className="fade-in mt-2 rounded border border-emerald-400/50 bg-emerald-900/40 px-3 py-3 text-center">
              <p className="font-bold text-emerald-200">Xác minh thành công.</p>
              <p className="mt-1 text-sm">
                Chủ nhân thật sự của không gian nhật ký: <b style={{ color: c.color }}>{c.l2}</b>
              </p>
              <button className="btn-green mt-3 !min-w-0 px-8 text-base" onClick={() => save({ i2_done: true })}>
                Tiếp tục
              </button>
            </div>
          )}
        </>
      )}
    </GameModal>
  );
}

function SecurityRow({
  slot, index, question, ok, onOk,
}: { slot: number; index: number; question: string; ok: boolean; onOk: () => void }) {
  const [val, setVal] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'wrong'>('idle');

  async function submit() {
    if (!val.trim()) return;
    setState('busy');
    try {
      const r = await checkAnswer({ kind: 'sec', slot, q: index, answer: val });
      if (r.ok) {
        onOk();
        setState('idle');
      } else setState('wrong');
    } catch {
      setState('wrong');
    }
  }

  return (
    <div>
      <p className={ok ? 'text-emerald-300' : 'text-[#f0b18c]'}>
        Câu hỏi {index}: {question} {ok && '✓'}
      </p>
      {!ok && (
        <div className="mt-1 flex gap-2">
          <input
            className="qq-input !py-2"
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              setState('idle');
            }}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoComplete="off"
          />
          <button
            className="shrink-0 border border-white/50 bg-white/10 px-3 text-sm font-bold"
            onClick={submit}
            disabled={state === 'busy'}
          >
            {state === 'busy' ? '…' : 'Trả lời'}
          </button>
        </div>
      )}
      {state === 'wrong' && (
        <p className="mt-1 text-xs text-red-300">Chưa đúng — hãy xem lại manh mối thân thế, bài văn và Nhật ký 1.</p>
      )}
    </div>
  );
}
