'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { DmGuard, useDmSession } from '@/components/dm/useDmSession';
import { STAGE_ORDER, normStage, type Room } from '@/lib/types';
import { STAGE_LABEL } from '@/components/dm/StageControl';

function randomCode() {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return String(a[0] % 100_000_000).padStart(8, '0');
}

function RoomList({ client, user }: { client: SupabaseClient; user: User }) {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showClosed, setShowClosed] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await client.from('rooms').select('*').eq('dm_id', user.id).order('created_at', { ascending: false }).limit(50);
    if (error) setErr(error.message);
    else setRooms((data ?? []).map((r) => ({ ...r, stage: normStage(r.stage) })) as Room[]);
  }, [client, user.id]);
  useEffect(() => { load(); }, [load]);

  async function create() {
    setBusy(true);
    setErr(null);
    for (let i = 0; i < 6; i++) {
      const { data, error } = await client.from('rooms').insert({ invite_code: randomCode(), name: name.trim() || null, dm_id: user.id }).select('id').single();
      if (!error && data) { router.push(`/dm/room/${data.id}`); return; }
      if (error && !error.message.includes('duplicate')) {
        setErr(error.code === '42501' || error.message.includes('row-level security')
          ? `Tài khoản ${user.email} chưa được cấp quyền DM. Chủ quán chạy trong Supabase SQL Editor: insert into public.dm_accounts(email) values ('${user.email}');`
          : error.message);
        break;
      }
    }
    setBusy(false);
  }

  async function remove(id: string) {
    await client.from('rooms').delete().eq('id', id);
    load();
  }

  const open = rooms.filter((r) => !r.closed_at);
  const closed = rooms.filter((r) => r.closed_at);
  const progressLabel = (r: Room) => {
    if (r.ending) return 'Đã phát kết cục';
    const last = [...STAGE_ORDER].reverse().find((k) => r.stage[k]);
    return last ? `Đang ở: ${STAGE_LABEL[last]}` : 'Chưa mở phòng chat';
  };

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--dm-mute)]">Thiên Hy Niên 2.0 · {user.email}</p>
          <h1 className="text-2xl font-bold">Lượt chơi của tôi</h1>
        </div>
        <button className="text-sm text-[var(--dm-mute)] underline" onClick={() => client.auth.signOut()}>Đăng xuất</button>
      </div>

      <div className="dm-card mt-5 p-4">
        <p className="font-semibold">Mở lượt chơi mới</p>
        <div className="mt-3 flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ghi chú (vd. Phòng 2 — 19h30)" className="min-w-0 flex-1 rounded-lg border border-[var(--dm-line)] px-3 py-2 outline-none focus:border-[var(--dm-pink)]" />
          <button onClick={create} disabled={busy} className="shrink-0 rounded-lg bg-[var(--dm-pink)] px-4 py-2 font-semibold text-white disabled:opacity-60">{busy ? '…' : 'Tạo'}</button>
        </div>
        <p className="mt-2 text-xs text-[var(--dm-mute)]">App tự sinh mã khóa lời mời 8 số. Mã QR in sẵn trong kịch bản dùng được cho mọi lượt chơi.</p>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      </div>

      <h2 className="mt-8 text-sm font-bold text-[var(--dm-mute)]">ĐANG MỞ</h2>
      <div className="mt-2 space-y-3">
        {open.length === 0 && <p className="text-sm text-[var(--dm-mute)]">Chưa có lượt chơi nào đang mở.</p>}
        {open.map((r) => (
          <Link key={r.id} href={`/dm/room/${r.id}`} className="dm-card flex items-center gap-3 p-4 active:bg-[var(--dm-soft)]">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-2xl font-bold tracking-[0.18em] text-[var(--dm-pink)]">{r.invite_code}</p>
              <p className="truncate text-sm">{r.name ?? 'Không ghi chú'} · {new Date(r.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</p>
              <p className="text-xs text-[var(--dm-mute)]">{progressLabel(r)}</p>
            </div>
            <span className="rounded-lg bg-[var(--dm-pink)] px-3 py-2 text-sm font-semibold text-white">Tiếp tục ›</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button className="text-sm font-bold text-[var(--dm-mute)]" onClick={() => setShowClosed((s) => !s)}>
          {showClosed ? '▼' : '▶'} ĐÃ ĐÓNG ({closed.length})
        </button>
        <Link href="/dm/qr" className="ml-auto text-sm text-[var(--dm-pink)] underline">In mã QR</Link>
      </div>
      {showClosed && (
        <div className="mt-2 space-y-2">
          {closed.map((r) => (
            <div key={r.id} className="dm-card flex items-center gap-3 px-4 py-3 text-sm">
              <span className="font-mono text-[var(--dm-mute)]">{r.invite_code}</span>
              <span className="min-w-0 flex-1 truncate">{r.name ?? ''} · {new Date(r.created_at).toLocaleDateString('vi-VN')}</span>
              <Link href={`/dm/room/${r.id}`} className="text-[var(--dm-pink)]">Xem</Link>
              <button className="text-red-600" onClick={() => remove(r.id)}>Xóa</button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function DmHome() {
  const { client } = useDmSession();
  return <DmGuard>{({ user }) => (client ? <RoomList client={client} user={user} /> : null)}</DmGuard>;
}
