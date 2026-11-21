'use client';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabaseConfigured = Boolean(URL && KEY);

// Hai client tách biệt khóa lưu phiên: DM (email) và người chơi (ẩn danh)
// → cùng một trình duyệt vẫn có thể vừa là DM vừa thử vai người chơi mà không đá phiên nhau.
let dm: SupabaseClient | null = null;
let player: SupabaseClient | null = null;

function make(storageKey: string) {
  return createClient(URL, KEY, {
    auth: { storageKey, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    realtime: { params: { eventsPerSecond: 10 } },
  });
}

export function dmClient(): SupabaseClient {
  if (!dm) dm = make('mtdm-dm-auth');
  return dm;
}

export function playerClient(): SupabaseClient {
  if (!player) player = make('mtdm-player-auth');
  return player;
}

export function publicMediaUrl(path: string) {
  return `${URL}/storage/v1/object/public/media/${path}`;
}
