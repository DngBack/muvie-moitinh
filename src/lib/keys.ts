'use client';
/** Khóa bí mật lưu ở trình duyệt — thay cho tài khoản đăng nhập. */

function get(k: string) { try { return localStorage.getItem(k); } catch { return null; } }
function set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* bỏ qua */ } }
function del(k: string) { try { localStorage.removeItem(k); } catch { /* bỏ qua */ } }

// ---------------- DM ----------------
export interface DmRoomRef { id: string; code: string; key: string; name: string | null; created: number }
const DM_ROOMS = 'mtdm-dm-rooms';

export function dmRooms(): DmRoomRef[] {
  try { return JSON.parse(get(DM_ROOMS) ?? '[]') as DmRoomRef[]; } catch { return []; }
}
export function saveDmRoom(r: DmRoomRef) {
  set(DM_ROOMS, JSON.stringify([r, ...dmRooms().filter((x) => x.id !== r.id)].slice(0, 30)));
}
export function forgetDmRoom(id: string) {
  set(DM_ROOMS, JSON.stringify(dmRooms().filter((x) => x.id !== id)));
}
export function dmKeyOf(id: string) { return dmRooms().find((x) => x.id === id)?.key ?? null; }

/** Link mở bảng điều khiển trên máy khác (chứa khóa DM). */
export function dmControlLink(id: string, key: string) {
  return `${window.location.origin}/dm/room/${id}?k=${key}`;
}

// ---------------- Người chơi ----------------
export interface Seat { roomId: string; slot: number; holder: string; key: string; code: string }
const SEAT = (slot: number) => `mtdm-seat-${slot}`;
const LAST = 'mtdm-seat-last';

export function readSeat(slot?: number | null): Seat | null {
  const s = slot ?? Number(get(LAST));
  if (!s) return null;
  try { return JSON.parse(get(SEAT(s)) ?? 'null') as Seat | null; } catch { return null; }
}
export function writeSeat(seat: Seat) { set(SEAT(seat.slot), JSON.stringify(seat)); set(LAST, String(seat.slot)); }
export function clearSeat(slot: number) { del(SEAT(slot)); }
export function lastCode() { return readSeat()?.code; }
