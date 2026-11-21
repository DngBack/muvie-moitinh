'use client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useCallback } from 'react';
import { useConfirm } from './Confirm';
import { charBySlot } from '@/content/characters';
import { ENDINGS } from '@/content/endings';
import { prerequisiteDone, STAGE_ORDER, type Ending, type PlayerRow, type Room, type StageKey } from '@/lib/types';

export const STAGE_LABEL: Record<StageKey, string> = {
  chat: 'Phòng chat', i1: 'Giao diện một', i2: 'Giao diện hai', i3: 'Giao diện ba', i4: 'Giao diện bốn',
  i5: 'Giao diện năm', i6: 'Giao diện sáu', final: 'Chương cuối',
};

const doneKey: Record<StageKey, string> = {
  chat: 'name_ok', i1: 'i1_done', i2: 'i2_done', i3: 'i3_done', i4: 'i4_done', i5: 'i5_done', i6: 'i6_done', final: 'final_done',
};

/** Hook dùng chung (Điều khiển + Kịch bản dẫn): mở một giai đoạn, có cảnh báo "chưa hoàn thành". */
export function useStageOpener(client: SupabaseClient, room: Room, players: PlayerRow[], setRoom: (r: Room) => void) {
  const ask = useConfirm();
  return useCallback(async (key: StageKey) => {
    if (room.stage[key]) return;
    const joined = players.filter((p) => p.auth_uid);
    const notDone = key === 'chat' ? [] : joined.filter((p) => !prerequisiteDone(key, p.progress ?? {}));
    if (notDone.length) {
      const ok = await ask({
        message: <>【{notDone.map((p) => charBySlot(p.slot).nick).join(', ')}】 vẫn chưa hoàn thành, có tiếp tục không?</>,
        ok: 'Tiếp tục', cancel: 'Hủy',
      });
      if (!ok) return;
    }
    if (key === 'chat' && joined.length < 6) {
      const ok = await ask({ message: `Mới có ${joined.length}/6 người vào. Vẫn mở phòng chat?` });
      if (!ok) return;
    }
    const stage = { ...room.stage, [key]: true };
    setRoom({ ...room, stage });
    const { error } = await client.from('rooms').update({ stage }).eq('id', room.id);
    if (error) await ask({ title: 'Lỗi', message: error.message, ok: 'OK' });
  }, [ask, client, room, players, setRoom]);
}

export function StageControl({
  client, room, players, setRoom,
}: { client: SupabaseClient; room: Room; players: PlayerRow[]; setRoom: (r: Room) => void }) {
  const ask = useConfirm();
  const open = useStageOpener(client, room, players, setRoom);
  const joined = players.filter((p) => p.auth_uid);
  const nextKey = STAGE_ORDER.find((k) => !room.stage[k]);
  const lastOpened = [...STAGE_ORDER].reverse().find((k) => room.stage[k]);

  async function reclose(key: StageKey) {
    if (key !== lastOpened) return;
    const ok = await ask({ message: `Đóng lại “${STAGE_LABEL[key]}”? Người chơi đang ở giai đoạn này sẽ quay về màn chờ.`, ok: 'Đóng lại', danger: true });
    if (!ok) return;
    const stage = { ...room.stage, [key]: false };
    setRoom({ ...room, stage });
    await client.from('rooms').update({ stage }).eq('id', room.id);
  }

  async function setEnding(e: Ending | null) {
    if (e && !room.stage.final) {
      await ask({ message: 'Hãy mở “Chương cuối” trước khi phát kết cục.', ok: 'OK' });
      return;
    }
    const ok = await ask({
      message: e ? <>Phát <b>{ENDINGS[e].title}</b> lên điện thoại người chơi?<br /><span className="text-sm text-[var(--dm-mute)]">Nhớ phát âm thanh {ENDINGS[e].cue} trước.</span></> : 'Gỡ kết cục, đưa người chơi về màn chờ?',
      ok: e ? 'Phát' : 'Gỡ',
    });
    if (!ok) return;
    setRoom({ ...room, ending: e });
    await client.from('rooms').update({ ending: e }).eq('id', room.id);
  }

  const doneCount = (k: StageKey) => joined.filter((p) => !!(p.progress as Record<string, unknown>)[doneKey[k]]).length;

  function Row({ k, last }: { k: StageKey; last?: boolean }) {
    const opened = room.stage[k];
    const isNext = k === nextKey;
    return (
      <div className="relative flex items-center gap-3 py-2.5 pl-6">
        <span className={`absolute left-0 top-0 w-4 border-l border-[#c9c5d1] ${last ? 'h-1/2' : 'h-full'}`} />
        <span className="absolute left-0 top-1/2 w-4 border-t border-[#c9c5d1]" />
        <span className="flex-1 text-[15px]">{STAGE_LABEL[k]}</span>
        {opened && joined.length > 0 && (
          <span className={`text-xs ${doneCount(k) === joined.length ? 'text-emerald-600' : 'text-[var(--dm-mute)]'}`}>
            {k === 'chat' ? 'tên đúng' : 'xong'} {doneCount(k)}/{joined.length}
          </span>
        )}
        {opened ? (
          <button className="dm-btn-done min-w-[76px] rounded-[3px] px-2 py-1 text-sm" onClick={() => reclose(k)}>Đã mở</button>
        ) : isNext ? (
          <button className="dm-btn-open min-w-[76px] rounded-[3px] px-2 py-1 text-sm font-semibold" onClick={() => open(k)}>Mở</button>
        ) : (
          <button className="dm-btn-wait min-w-[76px] rounded-[3px] px-2 py-1 text-sm" disabled>Chờ mở</button>
        )}
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="dm-bar mx-3 mt-3 flex items-center gap-2 rounded-md px-3 py-2.5 font-bold">
        <span aria-hidden>⚇</span> Điều khiển giai đoạn
      </div>

      <div className="px-5 pt-4">
        <p className="font-semibold text-[var(--dm-ink)]">Lượt chơi thứ nhất</p>
        <div className="ml-1"><Row k="chat" last /></div>

        <p className="mt-5 font-semibold">Lượt chơi thứ ba</p>
        <div className="ml-1">
          {(['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'final'] as StageKey[]).map((k, i, a) => <Row key={k} k={k} last={i === a.length - 1} />)}
        </div>

        <p className="mt-5 font-semibold">Kết cục</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {(['off', 'continue'] as Ending[]).map((e) => (
            <button
              key={e}
              onClick={() => setEnding(e)}
              className={`rounded-[3px] px-3 py-1.5 text-sm ${room.ending === e ? 'dm-btn-open font-semibold' : room.stage.final ? 'border border-[var(--dm-pink)] text-[var(--dm-pink)]' : 'dm-btn-wait'}`}
            >
              {ENDINGS[e].dmLabel}
            </button>
          ))}
          <span className="ml-auto text-xs text-[var(--dm-mute)]">{room.ending ? `Đã phát: ${ENDINGS[room.ending].title}` : 'Chờ phát'}</span>
        </div>
        {room.ending && <button className="mt-2 text-xs text-[var(--dm-mute)] underline" onClick={() => setEnding(null)}>Gỡ kết cục</button>}

        <div className="mt-6 rounded-lg bg-[var(--dm-soft)] p-3 text-xs leading-relaxed text-[var(--dm-mute)]">
          Phòng chat tự mở khi đủ 6 người vào. Mỗi lần mở giao diện mới, app sẽ báo nếu còn người chưa đọc xong / chưa nhập mật khẩu — hãy nhắc họ trước khi tiếp tục.
          Chỉ đóng lại được giai đoạn vừa mở gần nhất (bấm “Đã mở”).
        </div>
      </div>
    </div>
  );
}
