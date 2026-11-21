'use client';
/**
 * Xem trước màn hình người chơi (DM diễn tập / kiểm tra nội dung) — không ghi gì lên server.
 * /dm/preview?s=chat&slot=5   (s: login | chat | l1 | wait | i1..i6 | l2 | head | weapon | final | off | continue)
 */
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CHARACTERS, charBySlot } from '@/content/characters';
import { FINALE, INTERFACES } from '@/content/interfaces';
import type { Progress } from '@/lib/types';
import { InviteKeyScreen } from '@/components/player/InviteKeyScreen';
import { ChatRoom } from '@/components/player/ChatRoom';
import { DiaryLoginL1, DiaryLoginL2 } from '@/components/player/DiaryModal';
import { WaitingScreen } from '@/components/player/WaitingScreen';
import { DialoguePlayer, GlitchHeader } from '@/components/player/DialoguePlayer';
import { AnswerGate } from '@/components/player/AnswerGate';
import { EndingCard } from '@/components/player/EndingCard';
import { Scene } from '@/components/Scene';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ConfirmProvider } from '@/components/dm/Confirm';
import { AudioProvider } from '@/components/dm/AudioEngine';
import { StageControl } from '@/components/dm/StageControl';
import { ScriptPrompter } from '@/components/dm/ScriptPrompter';
import { PlayersPanel } from '@/components/dm/PlayersPanel';
import { DEFAULT_STAGE, type PlayerRow, type Room } from '@/lib/types';

/** Client giả: mọi thao tác ghi đều không làm gì (chế độ demo). */
const fakeClient = new Proxy({}, {
  get: () => () => new Proxy(Promise.resolve({ data: null, error: null }), {
    get: (t, k) => (k === 'then' ? t.then.bind(t) : () => fakeClient.from()),
  }),
}) as unknown as SupabaseClient & { from: () => unknown };

function DmDemo({ view }: { view: string }) {
  const now = new Date().toISOString();
  const [room, setRoom] = useState<Room>({
    id: 'demo', invite_code: '85967996', dm_id: 'demo', name: 'Demo', created_at: now, closed_at: null, ending: null, script_step: 3,
    stage: { ...DEFAULT_STAGE, chat: true, i1: true, i2: true },
  });
  const players: PlayerRow[] = CHARACTERS.map((c) => ({
    id: String(c.slot), room_id: 'demo', slot: c.slot, auth_uid: c.slot === 4 ? null : 'u' + c.slot, joined_at: now,
    last_seen: c.slot === 3 ? '2000-01-01T00:00:00Z' : now,
    progress: { name_ok: true, name_attempts: c.slot % 3, i1_done: true, i2_done: c.slot < 3, l2_ok: c.slot < 5, sec_1: true, sec_2: c.slot < 4 },
  }));
  return (
    <ConfirmProvider>
      <AudioProvider urlOf={() => null}>
        <div className="mx-auto min-h-[100dvh] max-w-2xl bg-white text-[var(--dm-ink)]">
          <header className="border-b border-[var(--dm-line)] px-3 py-2 text-[15px]">‹ Thiên Hy Niên 2.0 – Mã khóa lời mời: <b className="font-mono text-[var(--dm-pink)]">{room.invite_code}</b></header>
          {view === 'dmctl' && <StageControl client={fakeClient} room={room} players={players} setRoom={setRoom} />}
          {view === 'dmscript' && <ScriptPrompter room={room} step={room.script_step} onStep={(n) => setRoom({ ...room, script_step: n })} onOpen={() => {}} onLookup={() => {}} />}
          {view === 'dmplayers' && <PlayersPanel client={fakeClient} room={room} players={players} />}
        </div>
      </AudioProvider>
    </ConfirmProvider>
  );
}

const SCREENS: [string, string][] = [
  ['login', 'Nhập mã'], ['chat', 'Phòng chat'], ['l1', 'Mật khẩu 1'], ['wait', 'Tải nhật ký'],
  ['i1', 'GD1'], ['i2', 'GD2'], ['l2', 'Bảo mật'], ['i3', 'GD3'], ['i4', 'GD4'], ['head', 'Đáp án GD4'],
  ['i5', 'GD5'], ['weapon', 'Đáp án GD5'], ['i6', 'GD6'], ['final', 'Chương cuối'], ['off', 'Kết cục tắt'], ['continue', 'Kết cục tiếp'],
  ['dmctl', 'DM: Chủ trì'], ['dmscript', 'DM: Kịch bản'], ['dmplayers', 'DM: Lượt chơi'],
];

function Preview() {
  const sp = useSearchParams();
  const router = useRouter();
  const s = sp.get('s') ?? 'chat';
  const slot = Math.min(6, Math.max(1, Number(sp.get('slot') ?? 1)));
  const bare = sp.get('bare') === '1';
  const [prog, setProg] = useState<Progress>({});
  const save = (p: Progress) => setProg((o) => ({ ...o, ...p }));
  const go = (ns: string, nslot = slot) => router.replace(`/dm/preview?s=${ns}&slot=${nslot}${bare ? '&bare=1' : ''}`);
  const noop = () => {};

  let screen: React.ReactNode = null;
  const iface = [...INTERFACES, FINALE].find((d) => d.key === s);
  if (s === 'login') screen = <InviteKeyScreen character={charBySlot(slot)} onSubmit={noop} />;
  else if (s === 'chat') screen = <ChatRoom slot={slot} onlineCount={6} onOpenDiary={() => go('l1')} />;
  else if (s === 'l1') screen = <ChatRoom slot={slot} onlineCount={6} instant onOpenDiary={noop}><DiaryLoginL1 slot={slot} progress={prog} save={save} onClose={noop} /></ChatRoom>;
  else if (s === 'wait') screen = <WaitingScreen title="Đang tải nhật ký…" loading sub="Nhật ký đã được tải về cuốn kịch bản trước mặt bạn. Hãy làm theo hướng dẫn của người dẫn trò." />;
  else if (s === 'l2') screen = <ChatRoom slot={slot} onlineCount={6} instant onOpenDiary={noop}><DiaryLoginL2 slot={slot} progress={prog} save={save} onClose={noop} /></ChatRoom>;
  else if (s === 'head' || s === 'weapon') {
    const d = INTERFACES.find((x) => x.key === (s === 'head' ? 'i4' : 'i5'))!;
    screen = (
      <main className="qq-screen">
        <Scene scene={d.scene} />
        {d.header && <div className="relative z-10"><GlitchHeader kind={d.header} /></div>}
        <AnswerGate kind={s} attempts={Number(prog[`${s}_a`] ?? 0)} onWrong={() => save({ [`${s}_a`]: Number(prog[`${s}_a`] ?? 0) + 1 })} onOk={noop} />
      </main>
    );
  } else if (s.startsWith('dm')) screen = <DmDemo view={s} />;
  else if (s === 'off' || s === 'continue') screen = <EndingCard ending={s} slot={slot} onSaveLine={noop} />;
  else if (iface) screen = <DialoguePlayer key={s + slot} lines={iface.lines(slot)} scene={iface.scene} header={iface.header} title={iface.key === 'final' ? 'Chương cuối' : `Giao diện ${iface.no}`} onDone={noop} />;

  return (
    <div className="relative">
      {!bare && (
        <div className="fixed inset-x-0 top-0 z-[60] flex gap-1 overflow-x-auto bg-black/80 px-2 py-1.5 text-xs text-white">
          <select value={slot} onChange={(e) => go(s, Number(e.target.value))} className="rounded bg-white/15 px-1">
            {CHARACTERS.map((c) => <option key={c.slot} value={c.slot} className="text-black">{c.slot}. {c.nick}</option>)}
          </select>
          {SCREENS.map(([k, label]) => (
            <button key={k} onClick={() => go(k)} className={`shrink-0 rounded px-2 py-1 ${k === s ? 'bg-pink-600' : 'bg-white/10'}`}>{label}</button>
          ))}
        </div>
      )}
      {screen}
    </div>
  );
}

export default function PreviewPage() {
  return <Suspense><Preview /></Suspense>;
}
