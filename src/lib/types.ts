export type StageKey = 'chat' | 'i1' | 'i2' | 'i3' | 'i4' | 'i5' | 'i6' | 'final';
export type Stage = Record<StageKey, boolean>;
export type Ending = 'off' | 'continue';
export type Slot = 1 | 2 | 3 | 4 | 5 | 6;

export const STAGE_ORDER: StageKey[] = ['chat', 'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'final'];
export const IFACE_KEYS = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6'] as const;
export type IfaceKey = (typeof IFACE_KEYS)[number];

export interface Room {
  id: string;
  invite_code: string;
  dm_id: string;
  name: string | null;
  stage: Stage;
  ending: Ending | null;
  script_step: number;
  created_at: string;
  closed_at: string | null;
}

/** Tiến độ người chơi — khóa phẳng để server merge nông an toàn. */
export interface Progress {
  name_ok?: boolean;
  name_attempts?: number;
  l2_ok?: boolean;
  l2_attempts?: number;
  sec_1?: boolean;
  sec_2?: boolean;
  sec_3?: boolean;
  sec_4?: boolean;
  i1_line?: number; i1_done?: boolean;
  i2_line?: number; i2_read?: boolean; i2_done?: boolean;
  i3_line?: number; i3_done?: boolean;
  i4_line?: number; i4_read?: boolean; i4_done?: boolean; i4_attempts?: number;
  i5_line?: number; i5_read?: boolean; i5_done?: boolean; i5_attempts?: number;
  i6_line?: number; i6_done?: boolean;
  final_line?: number; final_done?: boolean;
  custom_line?: string;
  reset_at?: number;
  [k: string]: unknown;
}

export interface PlayerRow {
  id: string;
  room_id: string;
  slot: Slot;
  auth_uid: string | null;
  joined_at: string;
  last_seen: string;
  progress: Progress;
}

export const DEFAULT_STAGE: Stage = {
  chat: false, i1: false, i2: false, i3: false, i4: false, i5: false, i6: false, final: false,
};

export function normStage(s: Partial<Stage> | null | undefined): Stage {
  return { ...DEFAULT_STAGE, ...(s ?? {}) };
}

/** Điều kiện "đã hoàn thành giai đoạn trước" để mở giai đoạn k. */
export function prerequisiteDone(stage: StageKey, p: Progress): boolean {
  switch (stage) {
    case 'chat': return true;
    case 'i1': return !!p.name_ok;
    case 'i2': return !!p.i1_done;
    case 'i3': return !!p.i2_done;
    case 'i4': return !!p.i3_done;
    case 'i5': return !!p.i4_done;
    case 'i6': return !!p.i5_done;
    case 'final': return !!p.i6_done;
  }
}

export function isOnline(lastSeen: string | null | undefined, now = Date.now()) {
  if (!lastSeen) return false;
  return now - new Date(lastSeen).getTime() < 50_000;
}
