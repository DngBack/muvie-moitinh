'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useRoomSync } from '@/lib/useRoomSync';
import { useAssets } from '@/lib/useAssets';
import { cueById } from '@/content/audioCues';
import { DM_STEPS } from '@/content/dmScript';
import { isOnline, type Room } from '@/lib/types';
import { AudioProvider, useAudio } from './AudioEngine';
import { ConfirmProvider } from './Confirm';
import { StageControl, useStageOpener } from './StageControl';
import { LookupPanel, ScriptPrompter } from './ScriptPrompter';
import { AudioPanel } from './AudioPanel';
import { PlayersPanel } from './PlayersPanel';
import { DmShellMessage } from './useDmSession';

type Tab = 'control' | 'script' | 'audio' | 'lookup' | 'players';
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'control', label: 'Chủ trì', icon: '開' },
  { id: 'script', label: 'Kịch bản', icon: '📜' },
  { id: 'audio', label: 'Âm thanh', icon: '♫' },
  { id: 'lookup', label: 'Tra cứu', icon: '🔍' },
  { id: 'players', label: 'Lượt chơi', icon: '⚏' },
];

export function RoomConsole({ client, roomId }: { client: SupabaseClient; roomId: string }) {
  const sync = useRoomSync(client, roomId, 8000);
  const assets = useAssets(client);

  if (!sync.loaded) return <DmShellMessage title="Đang tải lượt chơi…" />;
  if (!sync.room) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-white px-6 text-center">
        <p className="font-semibold">Không tìm thấy lượt chơi này (hoặc không thuộc tài khoản của bạn).</p>
        <Link href="/dm" className="text-[var(--dm-pink)] underline">Về danh sách lượt chơi</Link>
      </div>
    );
  }

  return (
    <ConfirmProvider>
      <AudioProvider urlOf={assets.urlOf}>
        <Console client={client} room={sync.room} players={sync.players} setRoom={(r) => sync.setRoom(r)} connected={sync.connected} assets={assets} />
      </AudioProvider>
    </ConfirmProvider>
  );
}

function Console({
  client, room, players, setRoom, connected, assets,
}: {
  client: SupabaseClient;
  room: Room;
  players: ReturnType<typeof useRoomSync>['players'];
  setRoom: (r: Room) => void;
  connected: boolean;
  assets: ReturnType<typeof useAssets>;
}) {
  const [tab, setTabState] = useState<Tab>('control');
  const [lookupFocus, setLookupFocus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const audio = useAudio();
  const open = useStageOpener(client, room, players, setRoom);

  // Nhớ tab đang mở (theo thiết bị)
  useEffect(() => {
    try { const t = localStorage.getItem('mtdm-dm-tab') as Tab | null; if (t && TABS.some((x) => x.id === t)) setTabState(t); } catch { /* */ }
  }, []);
  const setTab = (t: Tab) => { setTabState(t); try { localStorage.setItem('mtdm-dm-tab', t); } catch { /* */ } window.scrollTo({ top: 0 }); };

  // Giữ màn hình DM luôn sáng trong lúc dẫn
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    const req = async () => { try { lock = (await nav.wakeLock?.request('screen')) ?? null; } catch { /* */ } };
    req();
    const onVis = () => { if (document.visibilityState === 'visible') req(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { document.removeEventListener('visibilitychange', onVis); lock?.release().catch(() => {}); };
  }, []);

  const setStep = useCallback(async (n: number) => {
    const step = Math.min(Math.max(n, 0), DM_STEPS.length - 1);
    setRoom({ ...room, script_step: step });
    await client.from('rooms').update({ script_step: step }).eq('id', room.id);
  }, [client, room, setRoom]);

  const onlineCount = players.filter((p) => p.auth_uid && isOnline(p.last_seen)).length;
  const joined = players.filter((p) => p.auth_uid).length;
  const nowPlaying = [audio.bgm, audio.sfx].filter(Boolean).map((id) => cueById(id!)?.name).join(' · ');

  async function copyCode() {
    try { await navigator.clipboard.writeText(room.invite_code); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  }

  return (
    <div className="dm-body mx-auto min-h-[100dvh] max-w-2xl bg-white text-[var(--dm-ink)]">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-[var(--dm-line)] bg-white/95 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur">
        <Link href="/dm" className="px-1 text-xl" aria-label="Về danh sách">‹</Link>
        <button onClick={copyCode} className="min-w-0 flex-1 truncate text-left text-[15px]">
          Thiên Hy Niên 2.0 – Mã khóa lời mời: <b className="font-mono tracking-wider text-[var(--dm-pink)]">{room.invite_code}</b>
          {copied && <span className="ml-2 text-xs text-emerald-600">đã chép</span>}
        </button>
        <span className="flex items-center gap-1 text-xs text-[var(--dm-mute)]" title={connected ? 'Realtime đã kết nối' : 'Đang kết nối lại…'}>
          <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
          {onlineCount}/{joined}
        </span>
      </header>
      {room.closed_at && <p className="bg-gray-100 px-4 py-2 text-center text-sm text-gray-600">Lượt chơi này đã đóng.</p>}

      <main>
        {tab === 'control' && <StageControl client={client} room={room} players={players} setRoom={setRoom} />}
        {tab === 'script' && (
          <ScriptPrompter room={room} step={room.script_step} onStep={setStep} onOpen={open} onLookup={(id) => { setLookupFocus(id); setTab('lookup'); }} />
        )}
        {tab === 'audio' && <AudioPanel client={client} assets={assets.rows} reload={assets.reload} />}
        {tab === 'lookup' && <LookupPanel focus={lookupFocus} />}
        {tab === 'players' && <PlayersPanel client={client} room={room} players={players} />}
      </main>

      {nowPlaying && (
        <div className="fixed inset-x-0 bottom-[60px] z-20 mx-auto flex max-w-2xl items-center gap-2 bg-[var(--dm-ink)] px-4 py-1.5 text-xs text-white" style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
          <span className="animate-pulse">♪</span>
          <span className="min-w-0 flex-1 truncate">{nowPlaying}</span>
          <button className="rounded bg-white/15 px-2 py-0.5" onClick={audio.stopAll}>■ Dừng</button>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-2xl border-t border-[var(--dm-line)] bg-white pb-[env(safe-area-inset-bottom)]">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="relative flex h-[60px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px]">
            {t.id === 'control' ? (
              <span className={`rounded px-1.5 text-xs font-black italic ${tab === t.id ? 'bg-[var(--dm-pink)] text-white' : 'border border-[var(--dm-ink)]'}`}>Mở</span>
            ) : (
              <span className={`text-lg leading-none ${tab === t.id ? 'text-[var(--dm-pink)]' : 'text-[var(--dm-ink)]'}`}>{t.icon}</span>
            )}
            <span className={tab === t.id ? 'font-semibold text-[var(--dm-pink)]' : 'text-[var(--dm-ink)]'}>{t.label}</span>
            {tab === t.id && <span className="absolute bottom-1 h-[3px] w-8 rounded bg-[var(--dm-ink)]" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
