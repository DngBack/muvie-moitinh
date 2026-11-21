'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { normStage, type PlayerRow, type Room } from './types';

/**
 * Đồng bộ một phòng: tải lần đầu + Realtime + tải lại khi quay lại tab / có mạng
 * + poll dự phòng (điện thoại khóa màn hình hay làm rớt websocket).
 */
export function useRoomSync(client: SupabaseClient | null, roomId: string | null, pollMs = 6000) {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const alive = useRef(true);

  const refresh = useCallback(async () => {
    if (!client || !roomId) return;
    const [r, p] = await Promise.all([
      client.from('rooms').select('*').eq('id', roomId).maybeSingle(),
      client.from('room_players').select('*').eq('room_id', roomId).order('slot'),
    ]);
    if (!alive.current) return;
    if (r.error) setError(r.error.message);
    else {
      setError(null);
      setRoom(r.data ? ({ ...r.data, stage: normStage(r.data.stage) } as Room) : null);
    }
    if (!p.error && p.data) setPlayers(p.data as PlayerRow[]);
    setLoaded(true);
  }, [client, roomId]);

  useEffect(() => {
    alive.current = true;
    if (!client || !roomId) return;
    refresh();

    const ch = client
      .channel(`room-${roomId}-${Math.random().toString(36).slice(2, 8)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, (payload) => {
        if (payload.eventType === 'DELETE') { setRoom(null); return; }
        const row = payload.new as Room;
        setRoom({ ...row, stage: normStage(row.stage) });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` }, (payload) => {
        if (payload.eventType === 'DELETE') {
          const old = payload.old as Partial<PlayerRow>;
          setPlayers((ps) => ps.filter((x) => x.id !== old.id));
          return;
        }
        const row = payload.new as PlayerRow;
        setPlayers((ps) => {
          const i = ps.findIndex((x) => x.id === row.id);
          const next = i >= 0 ? ps.map((x) => (x.id === row.id ? row : x)) : [...ps, row];
          return next.sort((a, b) => a.slot - b.slot);
        });
      })
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') refresh();
      });

    const onWake = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onWake);
    window.addEventListener('online', refresh);
    window.addEventListener('focus', refresh);
    const t = window.setInterval(refresh, pollMs);

    return () => {
      alive.current = false;
      document.removeEventListener('visibilitychange', onWake);
      window.removeEventListener('online', refresh);
      window.removeEventListener('focus', refresh);
      window.clearInterval(t);
      client.removeChannel(ch);
    };
  }, [client, roomId, refresh, pollMs]);

  return { room, players, setRoom, setPlayers, connected, error, loaded, refresh };
}
