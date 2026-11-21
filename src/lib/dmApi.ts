'use client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Ending, Progress, Stage } from './types';

export interface RoomPatch { stage?: Stage; ending?: Ending | null; script_step?: number; closed_at?: string | null; name?: string | null }

/** Mọi thao tác ghi của DM — đi qua hàm SQL, kèm khóa DM. Trả về thông báo lỗi hoặc null. */
export interface DmApi {
  updateRoom: (patch: RoomPatch) => Promise<string | null>;
  release: (slot: number) => Promise<string | null>;
  setProgress: (slot: number, progress: Progress) => Promise<string | null>;
  deleteRoom: () => Promise<string | null>;
}

function msg(e: { message: string } | null) {
  if (!e) return null;
  return e.message.includes('FORBIDDEN') ? 'Máy này không có khóa DM của lượt chơi (mở bằng link điều khiển).' : e.message;
}

export function makeDmApi(client: SupabaseClient, roomId: string, key: string): DmApi {
  const base = { p_room: roomId, p_key: key };
  return {
    updateRoom: async (patch) => msg((await client.rpc('dm_update_room', { ...base, p_patch: patch })).error),
    release: async (slot) => msg((await client.rpc('dm_seat', { ...base, p_slot: slot, p_action: 'release' })).error),
    setProgress: async (slot, progress) => msg((await client.rpc('dm_seat', { ...base, p_slot: slot, p_action: 'progress', p_progress: progress })).error),
    deleteRoom: async () => msg((await client.rpc('dm_delete_room', base)).error),
  };
}

/** Dùng cho trang xem trước: không ghi gì. */
export const noopDmApi: DmApi = {
  updateRoom: async () => null, release: async () => null, setProgress: async () => null, deleteRoom: async () => null,
};
