'use client';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClient, supabaseConfigured } from '@/lib/supabase';
import { dmRooms, forgetDmRoom, saveDmRoom, type DmRoomRef } from '@/lib/keys';
import { makeDmApi } from '@/lib/dmApi';
import { STAGE_ORDER, normStage, type Room } from '@/lib/types';
import { STAGE_LABEL } from '@/components/dm/StageControl';
import { DmShellMessage, NOT_CONFIGURED } from '@/components/dm/DmShell';

const EXPIRE_MS = 12 * 3600_000;

export default function DmHome() {
  const router = useRouter();
  const client = useMemo(() => (supabaseConfigured ? getClient() : null), []);
  const [refs, setRefs] = useState<DmRoomRef[]>([]);
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const list = dmRooms();
    setRefs(list);
    if (!client || !list.length) return;
    const { data, error } = await client.from('rooms').select('*').in('id', list.map((r) => r.id));
    if (error) return;
    const map: Record<string, Room> = {};
    for (const r of data ?? []) map[r.id] = { ...r, stage: normStage(r.stage) } as Room;
    setRooms(map);
    // Phòng đã bị xóa trên server (quá 2 ngày) → quên luôn
    list.filter((r) => !map[r.id] && Date.now() - r.created > 3600_000).forEach((r) => forgetDmRoom(r.id));
  }, [client]);
  useEffect(() => { load(); }, [load]);

  async function create() {
    if (!client) return;
    setBusy(true); setErr(null);
    const { data, error } = await client.rpc('create_room', { p_name: name.trim() || null });
    if (error || !data) { setErr(error?.message ?? 'Không tạo được lượt chơi'); setBusy(false); return; }
    const d = data as { id: string; code: string; key: string };
    saveDmRoom({ id: d.id, code: d.code, key: d.key, name: name.trim() || null, created: Date.now() });
    router.push(`/dm/room/${d.id}`);
  }

  async function remove(ref: DmRoomRef) {
    if (client) await makeDmApi(client, ref.id, ref.key).deleteRoom();
    forgetDmRoom(ref.id);
    load();
  }

  if (!client) return <DmShellMessage spin={false} {...NOT_CONFIGURED} />;

  const active = (r?: Room) => !!r && !r.closed_at && Date.now() - new Date(r.created_at).getTime() < EXPIRE_MS;
  const label = (r?: Room) => {
    if (!r) return 'Đã hết hạn';
    if (r.closed_at) return 'Đã đóng';
    if (!active(r)) return 'Hết hạn (quá 12 giờ)';
    if (r.ending) return 'Đã phát kết cục';
    const last = [...STAGE_ORDER].reverse().find((k) => r.stage[k]);
    return last ? `Đang ở: ${STAGE_LABEL[last]}` : 'Chưa mở phòng chat';
  };

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--dm-mute)]">Thiên Hy Niên 2.0</p>
          <h1 className="text-2xl font-bold">Người dẫn trò</h1>
        </div>
        <Link href="/dm/qr" className="text-sm text-[var(--dm-pink)] underline">In mã QR</Link>
      </div>

      <div className="dm-card mt-5 p-4">
        <p className="font-semibold">Mở lượt chơi mới</p>
        <div className="mt-3 flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ghi chú (vd. Phòng 2 — 19h30)" className="min-w-0 flex-1 rounded-lg border border-[var(--dm-line)] px-3 py-2 outline-none focus:border-[var(--dm-pink)]" />
          <button onClick={create} disabled={busy} className="shrink-0 rounded-lg bg-[var(--dm-pink)] px-4 py-2 font-semibold text-white disabled:opacity-60">{busy ? '…' : 'Tạo'}</button>
        </div>
        <p className="mt-2 text-xs text-[var(--dm-mute)]">
          App sinh mã khóa lời mời 8 số cho người chơi. Không cần tài khoản — máy này tự nhớ các lượt chơi bạn tạo.
          Mã có hiệu lực 12 giờ, dữ liệu tự xóa sau 2 ngày.
        </p>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      </div>

      <h2 className="mt-8 text-sm font-bold text-[var(--dm-mute)]">LƯỢT CHƠI TRÊN MÁY NÀY</h2>
      <div className="mt-2 space-y-3">
        {refs.length === 0 && <p className="text-sm text-[var(--dm-mute)]">Chưa có lượt chơi nào.</p>}
        {refs.map((ref) => {
          const r = rooms[ref.id];
          const on = active(r);
          return (
            <div key={ref.id} className={`dm-card flex items-center gap-3 p-4 ${on ? '' : 'opacity-60'}`}>
              <Link href={`/dm/room/${ref.id}`} className="min-w-0 flex-1">
                <p className={`font-mono font-bold tracking-[0.18em] ${on ? 'text-2xl text-[var(--dm-pink)]' : 'text-lg'}`}>{ref.code}</p>
                <p className="truncate text-sm">{ref.name ?? 'Không ghi chú'} · {new Date(ref.created).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</p>
                <p className="text-xs text-[var(--dm-mute)]">{label(r)}</p>
              </Link>
              {on ? (
                <Link href={`/dm/room/${ref.id}`} className="shrink-0 rounded-lg bg-[var(--dm-pink)] px-3 py-2 text-sm font-semibold text-white">Tiếp tục ›</Link>
              ) : (
                <button className="shrink-0 text-sm text-red-600" onClick={() => remove(ref)}>Xóa</button>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
