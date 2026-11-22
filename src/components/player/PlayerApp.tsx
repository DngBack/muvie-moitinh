'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getClient, supabaseConfigured } from '@/lib/supabase';
import { clearSeat, lastCode, readSeat, writeSeat, type Seat } from '@/lib/keys';
import { useRoomSync } from '@/lib/useRoomSync';
import { isOnline, type Progress, type StageKey } from '@/lib/types';
import { charBySlot } from '@/content/characters';
import { FINALE, INTERFACES, type IfaceDef } from '@/content/interfaces';
import { JoinScreen } from './JoinScreen';
import { WaitingScreen } from './WaitingScreen';
import { ChatRoom } from './ChatRoom';
import { DiaryLoginL1, DiaryLoginL2 } from './DiaryModal';
import { DialoguePlayer, GlitchHeader } from './DialoguePlayer';
import { AnswerGate } from './AnswerGate';
import { EndingCard } from './EndingCard';
import { Scene } from '../Scene';

/** Lượt chơi quá 16 giờ coi như đã kết thúc (thiết bị còn nhớ ghế cũ). */
const STALE_MS = 16 * 3600_000;
// Chưa có ảnh nền thật → dùng hình vẽ mô phỏng. Khi có file: trả về URL ảnh theo key (bg_chat, bg_path, …).
const urlOf = (_key: string): string | null => null;

type Phase = 'boot' | 'join' | 'in' | 'error';

/** Âm báo nhẹ khi có giai đoạn mới mở (sổ tay: nhắc người chơi bật âm thanh điện thoại). */
function chime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [660, 990].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      o.type = 'triangle';
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.14);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.14 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.14 + 0.35);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.14);
      o.stop(ctx.currentTime + i * 0.14 + 0.4);
    });
    navigator.vibrate?.([80, 60, 80]);
  } catch { /* không có âm thanh cũng không sao */ }
}

export function PlayerApp({ routeSlot }: { routeSlot: number | null }) {
  const client = useMemo(() => (supabaseConfigured ? getClient() : null), []);
  const [phase, setPhase] = useState<Phase>('boot');
  const [seat, setSeat] = useState<Seat | null>(null);
  const [slot, setSlot] = useState<number | null>(routeSlot);
  const roomId = seat?.roomId ?? null;
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [linkCode, setLinkCode] = useState<string | undefined>(undefined);

  // ---------- Khởi động: tìm ghế đã lưu trên thiết bị (không cần đăng nhập) ----------
  useEffect(() => {
    if (!client) { setPhase('error'); setErr('Chưa cấu hình Supabase (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).'); return; }
    // Link DM gửi có dạng /?code=12345678
    const q = new URLSearchParams(window.location.search).get('code')?.replace(/\D/g, '').slice(0, 8);
    if (q) setLinkCode(q);
    const saved = readSeat(routeSlot);
    if (saved && (!q || q === saved.code)) { setSeat(saved); setSlot(saved.slot); setPhase('in'); }
    else setPhase('join');
  }, [client, routeSlot]);

  const leave = useCallback((message: string | null) => {
    if (slot) clearSeat(slot);
    setSeat(null);
    setErr(message);
    setPhase('join');
  }, [slot]);

  const join = useCallback(async (code: string, pickSlot: number) => {
    if (!client) return;
    setBusy(true); setErr(null);
    setSlot(pickSlot);
    const { data, error } = await client.rpc('join_room', { p_code: code.trim(), p_slot: pickSlot });
    setBusy(false);
    if (error) {
      setErr(error.message.includes('INVALID_CODE') ? 'Mã khóa không đúng hoặc lượt chơi đã đóng. Hãy hỏi lại người dẫn trò.' : 'Không vào được: ' + error.message);
      return;
    }
    const d = data as { room_id: string; slot: number; holder: string; key: string };
    const next: Seat = { roomId: d.room_id, slot: d.slot, holder: d.holder, key: d.key, code: code.trim() };
    writeSeat(next);
    setSeat(next);
    setPhase('in');
  }, [client]);

  // ---------- Đồng bộ phòng ----------
  const { room, players, loaded, refresh } = useRoomSync(phase === 'in' ? client : null, roomId);
  const me = players.find((p) => p.slot === slot);

  // Tiến độ: server + ghi đè cục bộ (lạc quan); hàng đợi gửi lại khi mất mạng
  const [ov, setOv] = useState<Progress>({});
  const pending = useRef<Progress>({});
  const lastReset = useRef<unknown>('init');
  useEffect(() => {
    const r = me?.progress?.reset_at;
    if (lastReset.current !== 'init' && r !== lastReset.current) { setOv({}); pending.current = {}; }
    if (me) lastReset.current = r;
  }, [me]);
  const progress: Progress = useMemo(() => ({ ...(me?.progress ?? {}), ...ov }), [me, ov]);

  const flush = useCallback(async () => {
    if (!client || !seat) return;
    const patch = pending.current;
    pending.current = {};
    const { error } = await client.rpc('save_progress', { p_room: seat.roomId, p_slot: seat.slot, p_key: seat.key, p_patch: patch });
    if (error) pending.current = { ...patch, ...pending.current };
  }, [client, seat]);

  const save = useCallback((patch: Progress) => {
    setOv((o) => ({ ...o, ...patch }));
    pending.current = { ...pending.current, ...patch };
    void flush();
  }, [flush]);

  // Heartbeat 20s
  useEffect(() => {
    if (phase !== 'in') return;
    const t = window.setInterval(() => { void flush(); }, 20_000);
    void flush();
    return () => window.clearInterval(t);
  }, [phase, flush]);

  // Bị thiết bị khác chiếm ghế / DM giải phóng ghế / phòng đóng
  useEffect(() => {
    if (phase !== 'in' || !loaded || !seat) return;
    if (!room) { leave('Lượt chơi không còn tồn tại. Hãy nhập mã phòng mới.'); return; }
    if (me && me.holder !== seat.holder) leave(me.holder ? 'Vai này vừa được đăng nhập trên thiết bị khác. Nhập lại mã phòng và chọn vai để lấy lại.' : 'Người dẫn trò đã giải phóng thiết bị. Nhập lại mã phòng và chọn vai để vào lại (tiến độ vẫn giữ nguyên).');
  }, [phase, loaded, room, me, seat, leave]);

  // Âm báo khi DM mở giai đoạn mới
  const prevStage = useRef<string>('');
  useEffect(() => {
    if (!room) return;
    const sig = JSON.stringify(room.stage) + (room.ending ?? '');
    if (prevStage.current && prevStage.current !== sig) chime();
    prevStage.current = sig;
  }, [room]);

  const [diaryOpen, setDiaryOpen] = useState(false);
  const [replay, setReplay] = useState<string | null>(null);

  // ---------- Render ----------
  if (phase === 'error') return <WaitingScreen title="Không thể khởi động" sub={err ?? ''} />;
  if (phase === 'boot') return <WaitingScreen title="Đang kết nối giao diện não–máy…" loading />;
  if (phase === 'join' && client) {
    return <JoinScreen client={client} initialCode={linkCode ?? lastCode()} initialSlot={slot} error={err} busy={busy} onSubmit={join} />;
  }
  if (!slot || !room || !me) return <WaitingScreen title="Đang tải lượt chơi…" loading />;

  if (room.closed_at || Date.now() - new Date(room.created_at).getTime() > STALE_MS) {
    return (
      <WaitingScreen title="Lượt chơi đã kết thúc" sub="Cảm ơn bạn đã trải nghiệm 《Mối Tình Đẫm Máu》." scene="void">
        <button onClick={() => leave(null)} className="mt-8 text-xs text-white/60 underline">Vào lượt chơi khác</button>
      </WaitingScreen>
    );
  }

  const st = room.stage;
  const online = players.filter((p) => p.holder && isOnline(p.last_seen)).length;

  // Kết cục
  if (room.ending) {
    return (
      <EndingCard
        ending={room.ending}
        slot={slot}
        customLine={progress.custom_line}
        bgUrl={urlOf(room.ending === 'continue' ? 'bg_room' : 'bg_void')}
        onSaveLine={(s) => save({ custom_line: s })}
      />
    );
  }

  // Xem lại một giao diện đã hoàn thành
  if (replay) {
    const def = replay === 'final' ? FINALE : INTERFACES.find((i) => i.key === replay)!;
    return (
      <DialoguePlayer
        key={'replay-' + replay}
        lines={def.lines(slot)}
        scene={def.scene}
        bgUrl={urlOf(`bg_${def.scene}`)}
        header={def.header}
        title={`Xem lại · Giao diện ${def.no}`}
        onDone={() => setReplay(null)}
      />
    );
  }

  // Lượt chơi thứ ba: giao diện đầu tiên đã mở mà chưa hoàn thành
  const seq: IfaceDef[] = [...INTERFACES, FINALE];
  const doneOf = (k: string) => !!progress[`${k}_done`];
  const current = seq.find((d) => st[d.key as StageKey] && !doneOf(d.key));
  const anyOpen = seq.some((d) => st[d.key as StageKey]);

  if (current) return <IfaceView def={current} slot={slot} progress={progress} save={save} bgUrl={urlOf(`bg_${current.scene}`)} onlineCount={online} chatBg={urlOf('bg_chat')} />;

  if (anyOpen) {
    const done = seq.filter((d) => st[d.key as StageKey] && doneOf(d.key));
    const finalDone = st.final && doneOf('final');
    return (
      <WaitingScreen
        title={finalDone ? 'Hãy đưa ra lựa chọn của bạn' : 'Không có nội dung mới'}
        sub={finalDone
          ? 'Chỉ khi đèn nến tín hiệu của tất cả mọi người đều tắt, trò chơi mới hoàn toàn bị tắt. Nếu không, trò chơi sẽ tiếp tục vận hành.'
          : 'Phần tương tác của giai đoạn này đã hoàn thành. Hãy chờ người dẫn trò mở giao diện tiếp theo.'}
        scene={finalDone ? 'field' : 'void'}
      >
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {done.map((d) => (
            <button key={d.key} onClick={() => setReplay(d.key)} className="rounded border border-white/25 px-3 py-1.5 text-xs text-white/80 active:bg-white/10">
              Xem lại {d.key === 'final' ? 'Chương cuối' : `Giao diện ${d.no}`}
            </button>
          ))}
        </div>
        <button onClick={() => void refresh()} className="mt-6 text-xs text-white/50 underline">Làm mới</button>
      </WaitingScreen>
    );
  }

  // Lượt chơi thứ nhất
  if (!st.chat) {
    return (
      <WaitingScreen
        title="Đã kết nối. Chờ mở phòng chat…"
        sub={`Bạn là [${charBySlot(slot).nick}]. Phòng chat sẽ tự mở khi cả 6 người đã vào (đã vào: ${players.filter((p) => p.holder).length}/6). Đừng lật kịch bản nhé!`}
        loading
      >
        <button onClick={() => leave(null)} className="mt-8 text-xs text-white/50 underline">Chọn nhầm nhân vật? Đổi vai</button>
      </WaitingScreen>
    );
  }
  if (!progress.name_ok) {
    return (
      <ChatRoom slot={slot} onlineCount={online} bgUrl={urlOf('bg_chat')} onOpenDiary={() => setDiaryOpen(true)}>
        {diaryOpen && <DiaryLoginL1 slot={slot} progress={progress} save={save} onClose={() => setDiaryOpen(false)} />}
      </ChatRoom>
    );
  }
  return (
    <WaitingScreen
      title="Đang tải nhật ký…"
      loading
      sub="Nhật ký đã được tải về cuốn kịch bản trước mặt bạn. Hãy làm theo hướng dẫn của người dẫn trò. Lượt chơi thứ ba sẽ quay lại đây — chỉ cần quét mã QR trong “Thư của Hoan Hoan”."
    />
  );
}

/** Một giao diện lượt 3: đọc hội thoại → (nếu có) cổng trả lời → hoàn thành */
function IfaceView({
  def, slot, progress, save, bgUrl, onlineCount, chatBg,
}: {
  def: IfaceDef; slot: number; progress: Progress; save: (p: Progress) => void;
  bgUrl: string | null; onlineCount: number; chatBg: string | null;
}) {
  const k = def.key;
  const lines = def.lines(slot);
  const read = !!progress[`${k}_read`];
  const [modalOpen, setModalOpen] = useState(true);

  if (!def.gate || !read) {
    return (
      <DialoguePlayer
        key={k}
        lines={lines}
        start={Number(progress[`${k}_line`] ?? 0)}
        scene={def.scene}
        bgUrl={bgUrl}
        header={def.header}
        title={def.key === 'final' ? 'Chương cuối' : `Giao diện ${def.no}`}
        onLine={(i) => save({ [`${k}_line`]: i })}
        onDone={() => save(def.gate ? { [`${k}_read`]: true } : { [`${k}_done`]: true })}
      />
    );
  }

  if (def.gate === 'l2') {
    return (
      <ChatRoom slot={slot} onlineCount={onlineCount} bgUrl={chatBg} instant onOpenDiary={() => setModalOpen(true)} diaryLabel="Nhấn để xác minh lại nhật ký">
        {modalOpen && <DiaryLoginL2 slot={slot} progress={progress} save={save} onClose={() => setModalOpen(false)} />}
      </ChatRoom>
    );
  }

  const gate = def.gate;
  const attemptsKey = `${k}_attempts`;
  return (
    <main className="qq-screen">
      <Scene scene={def.scene} imageUrl={bgUrl} />
      {def.header && <div className="relative z-10"><GlitchHeader kind={def.header} /></div>}
      <AnswerGate
        kind={gate}
        attempts={Number(progress[attemptsKey] ?? 0)}
        onWrong={() => save({ [attemptsKey]: Number(progress[attemptsKey] ?? 0) + 1 })}
        onOk={() => save({ [`${k}_done`]: true })}
      />
    </main>
  );
}
