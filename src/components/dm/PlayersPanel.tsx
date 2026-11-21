'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DmApi } from '@/lib/dmApi';
import { dmControlLink } from '@/lib/keys';
import { CHARACTERS } from '@/content/characters';
import { useConfirm } from './Confirm';
import { isOnline, type PlayerRow, type Progress, type Room } from '@/lib/types';

/** Bước người chơi đang cần hoàn thành (để DM "mở khóa" khi người chơi kẹt). */
function currentNeed(room: Room, p: Progress): { key: string; label: string } | null {
  if (room.stage.chat && !p.name_ok) return { key: 'name_ok', label: 'nhập tên (phòng chat)' };
  const seq = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'final'] as const;
  for (const k of seq) {
    if (room.stage[k] && !p[`${k}_done`]) return { key: `${k}_done`, label: k === 'final' ? 'Chương cuối' : `Giao diện ${k.slice(1)}` };
  }
  return null;
}

export function PlayersPanel({ api, room, players, dmKey }: { api: DmApi; dmKey: string; room: Room; players: PlayerRow[] }) {
  const ask = useConfirm();
  const router = useRouter();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 10_000); return () => window.clearInterval(t); }, []);

  const bySlot = (slot: number) => players.find((p) => p.slot === slot);

  async function release(p: PlayerRow, nick: string) {
    if (!(await ask({ message: `Giải phóng thiết bị đang giữ vai [${nick}]? Người chơi nhập lại mã khóa là vào lại được, tiến độ vẫn giữ nguyên.` }))) return;
    await api.release(p.slot);
  }
  async function unlock(p: PlayerRow, nick: string) {
    const need = currentNeed(room, p.progress ?? {});
    if (!need) return;
    if (!(await ask({ message: `Đánh dấu [${nick}] đã hoàn thành “${need.label}”?` }))) return;
    const extra: Progress = need.key === 'i2_done' ? { l2_ok: true, sec_1: true, sec_2: true, sec_3: true, sec_4: true } : {};
    await api.setProgress(p.slot, { ...(p.progress ?? {}), ...extra, [need.key]: true });
  }
  async function reset(p: PlayerRow, nick: string) {
    if (!(await ask({ message: `Xóa toàn bộ tiến độ của [${nick}]? Thao tác này không hoàn tác được.`, ok: 'Xóa tiến độ', danger: true }))) return;
    await api.setProgress(p.slot, { reset_at: Date.now() });
  }
  async function closeRoom() {
    if (!(await ask({ title: 'Đóng phòng', message: 'Kết thúc lượt chơi này? Người chơi sẽ thấy màn “Lượt chơi đã kết thúc” và mã khóa hết hiệu lực.', ok: 'Đóng phòng', danger: true }))) return;
    await api.updateRoom({ closed_at: new Date().toISOString() });
    router.push('/dm');
  }
  async function reopen() {
    await api.updateRoom({ closed_at: null });
  }

  return (
    <div className="space-y-3 px-4 pb-24 pt-4">
      <div className="dm-card flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs text-[var(--dm-mute)]">Mã khóa lời mời</p>
          <p className="font-mono text-3xl font-bold tracking-[0.2em] text-[var(--dm-pink)]">{room.invite_code}</p>
        </div>
        <Link href="/dm/qr" target="_blank" className="rounded-lg border border-[var(--dm-line)] px-3 py-2 text-sm">In mã QR</Link>
      </div>
      <ControlLink roomId={room.id} dmKey={dmKey} />

      {CHARACTERS.map((c) => {
        const p = bySlot(c.slot);
        const pr: Progress = p?.progress ?? {};
        const online = !!p?.holder && isOnline(p.last_seen, now);
        const need = p ? currentNeed(room, pr) : null;
        const chips: [string, boolean | undefined][] = [
          ['Tên', pr.name_ok], ['GD1', pr.i1_done], ['GD2', pr.i2_done], ['GD3', pr.i3_done],
          ['GD4', pr.i4_done], ['GD5', pr.i5_done], ['GD6', pr.i6_done], ['Cuối', pr.final_done],
        ];
        const sec = [pr.sec_1, pr.sec_2, pr.sec_3, pr.sec_4].filter(Boolean).length;
        return (
          <div key={c.slot} className="dm-card px-4 py-3">
            <div className="flex items-start gap-3">
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${!p?.holder ? 'bg-gray-300' : online ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <div className="min-w-0 flex-1">
                <p className="font-bold">
                  <span style={{ color: c.color === '#f2c46d' ? '#b98a1e' : c.color }}>[{c.nick}]</span>
                  <span className="ml-2 text-xs font-normal text-[var(--dm-mute)]">Thư mời {c.slot}</span>
                </p>
                <p className="text-xs text-[var(--dm-mute)]">{c.l1} → {c.l2}</p>
                <p className="text-xs text-[var(--dm-mute)]">
                  {!p?.holder ? 'Chưa vào' : online ? 'Đang trực tuyến' : 'Mất kết nối (khóa màn hình / thoát app)'}
                </p>
              </div>
            </div>
            {p && (
              <>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {chips.map(([label, ok]) => (
                    <span key={label} className={`rounded px-1.5 py-0.5 text-[11px] ${ok ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>{label}{ok ? ' ✓' : ''}</span>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-[var(--dm-mute)]">
                  Nhập tên sai: {pr.name_attempts ?? 0}
                  {room.stage.i2 && ` · Tên lớp 2: ${pr.l2_ok ? '✓' : `sai ${pr.l2_attempts ?? 0}`} · Bảo mật ${sec}/4`}
                  {room.stage.i4 && ` · GD4 sai ${pr.i4_attempts ?? 0}`}
                  {room.stage.i5 && ` · GD5 sai ${pr.i5_attempts ?? 0}`}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {need && <button className="rounded-md border border-[var(--dm-pink)] px-2.5 py-1 text-xs text-[var(--dm-pink)]" onClick={() => unlock(p, c.nick)}>Mở khóa: {need.label}</button>}
                  {p.holder && <button className="rounded-md border border-[var(--dm-line)] px-2.5 py-1 text-xs" onClick={() => release(p, c.nick)}>Giải phóng thiết bị</button>}
                  <button className="rounded-md border border-[var(--dm-line)] px-2.5 py-1 text-xs text-red-600" onClick={() => reset(p, c.nick)}>Xóa tiến độ</button>
                </div>
              </>
            )}
          </div>
        );
      })}

      <div className="pt-4">
        {room.closed_at ? (
          <button className="w-full rounded-lg border border-[var(--dm-line)] py-3 font-semibold" onClick={reopen}>Mở lại phòng</button>
        ) : (
          <button className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white" onClick={closeRoom}>⏻ Đóng phòng</button>
        )}
      </div>
    </div>
  );
}

/** Link chứa khóa DM — mở trên máy khác để tiếp tục điều khiển (không cần tài khoản). */
function ControlLink({ roomId, dmKey }: { roomId: string; dmKey: string }) {
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => { setLink(dmControlLink(roomId, dmKey)); }, [roomId, dmKey]);
  async function copy() {
    try { await navigator.clipboard.writeText(link); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  }
  return (
    <div className="dm-card px-4 py-3">
      <p className="text-sm font-semibold">Link điều khiển (dành cho DM)</p>
      <p className="mt-1 text-xs text-[var(--dm-mute)]">Máy này đã tự nhớ lượt chơi. Muốn điều khiển từ máy khác thì mở link này — đừng gửi cho người chơi.</p>
      <div className="mt-2 flex gap-2">
        <input readOnly value={link} className="min-w-0 flex-1 rounded-md border border-[var(--dm-line)] bg-[var(--dm-soft)] px-2 py-1.5 font-mono text-[11px]" onFocus={(e) => e.target.select()} />
        <button onClick={copy} className="shrink-0 rounded-md border border-[var(--dm-pink)] px-3 text-sm text-[var(--dm-pink)]">{copied ? 'Đã chép' : 'Chép'}</button>
      </div>
    </div>
  );
}
