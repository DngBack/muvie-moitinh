'use client';
import { useRef, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { CUES, SCENE_SLOTS, type Cue } from '@/content/audioCues';
import { useAudio } from './AudioEngine';
import { useConfirm } from './Confirm';
import type { AssetRow } from '@/lib/useAssets';

const KIND_LABEL: Record<Cue['kind'], string> = { bgm: 'Nhạc nền', sfx: 'Âm thanh', voice: 'Âm thanh', video: 'Video' };

export function AudioPanel({
  client, assets, reload,
}: { client: SupabaseClient; assets: AssetRow[]; reload: () => Promise<void> }) {
  const audio = useAudio();
  const ask = useConfirm();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const row = (key: string) => assets.find((a) => a.key === key);

  async function upload(key: string, file: File) {
    setBusyKey(key);
    setErr(null);
    try {
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
      const path = `${key.startsWith('bg_') ? 'scenes' : 'cues'}/${key}-${Date.now()}.${ext}`;
      const up = await client.storage.from('media').upload(path, file, { contentType: file.type || undefined, upsert: true });
      if (up.error) throw up.error;
      const old = row(key);
      const { error } = await client.from('assets').upsert({
        key, storage_path: path, mime: file.type, file_name: file.name, updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      if (old) await client.storage.from('media').remove([old.storage_path]);
      await reload();
    } catch (e) {
      setErr(`Tải lên thất bại: ${(e as Error).message}`);
    } finally {
      setBusyKey(null);
    }
  }

  async function remove(key: string) {
    const r = row(key);
    if (!r) return;
    const ok = await ask({ message: `Xóa file “${r.file_name ?? r.storage_path}”?`, ok: 'Xóa', danger: true });
    if (!ok) return;
    await client.from('assets').delete().eq('key', key);
    await client.storage.from('media').remove([r.storage_path]);
    await reload();
  }

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-10 space-y-2 border-b border-[var(--dm-line)] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-sm">🔊</span>
          <input type="range" min={0} max={1} step={0.05} value={audio.volume} onChange={(e) => audio.setVolume(Number(e.target.value))} className="flex-1 accent-[var(--dm-pink)]" />
          <button className="rounded-full border border-[var(--dm-line)] px-3 py-1 text-sm" onClick={audio.stopAll}>■ Dừng hết</button>
        </div>
        <label className="flex items-center gap-2 text-xs text-[var(--dm-mute)]">
          <input type="checkbox" checked={showUpload} onChange={(e) => setShowUpload(e.target.checked)} /> Hiện nút tải file / thay file
        </label>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>

      <div className="divide-y divide-[var(--dm-line)]">
        {CUES.map((c) => {
          const r = row(c.key);
          const playing = audio.bgm === c.id || audio.sfx === c.id;
          return (
            <div key={c.id} className="flex items-center gap-3 px-4 py-3">
              <span className="w-9 shrink-0 text-center font-mono text-sm text-[var(--dm-mute)]">{c.no === 'news' ? '▶' : c.no}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{c.name} {c.original && <span className="text-xs font-normal text-[var(--dm-mute)]">{c.original}</span>}</p>
                <p className="truncate text-xs text-[var(--dm-mute)]">
                  {KIND_LABEL[c.kind]} · {r ? <span className="text-emerald-700">✓ {r.file_name}</span> : c.script ? 'chưa có file — đọc văn bản / giọng máy' : <span className="text-amber-700">chưa có file</span>}
                </p>
                <p className="truncate text-xs text-[var(--dm-mute)]">{c.when}</p>
              </div>
              {showUpload && (
                <UploadButton accept={c.kind === 'video' ? 'video/*' : 'audio/*'} busy={busyKey === c.key} onFile={(f) => upload(c.key, f)} hasFile={!!r} onRemove={() => remove(c.key)} />
              )}
              <button
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${playing ? 'bg-[var(--dm-pink)] text-white' : 'border border-[var(--dm-pink)] text-[var(--dm-pink)]'}`}
                onClick={() => (playing ? (c.kind === 'bgm' ? audio.stopBgm() : audio.stopSfx()) : audio.play(c.id))}
              >
                {playing ? '■' : '▶'}
              </button>
            </div>
          );
        })}
      </div>

      <h3 className="mt-6 px-4 text-sm font-bold text-[var(--dm-mute)]">ẢNH NỀN CẢNH (tùy chọn — thay hình vẽ mô phỏng)</h3>
      <div className="divide-y divide-[var(--dm-line)]">
        {SCENE_SLOTS.map((s) => {
          const r = row(s.key);
          return (
            <div key={s.key} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{s.name}</p>
                <p className="truncate text-xs text-[var(--dm-mute)]">{s.usedIn} · {r ? <span className="text-emerald-700">✓ {r.file_name}</span> : 'đang dùng hình vẽ mô phỏng'}</p>
              </div>
              <UploadButton accept="image/*" busy={busyKey === s.key} onFile={(f) => upload(s.key, f)} hasFile={!!r} onRemove={() => remove(s.key)} />
            </div>
          );
        })}
      </div>
      <p className="px-4 pt-4 text-xs leading-relaxed text-[var(--dm-mute)]">
        File được lưu trên Supabase Storage và dùng chung cho mọi lượt chơi. Âm thanh phát trên thiết bị DM (hãy nối loa). Khi cần trình chiếu video, mở bằng thiết bị nối máy chiếu/TV.
      </p>
    </div>
  );
}

function UploadButton({
  accept, busy, onFile, hasFile, onRemove,
}: { accept: string; busy: boolean; onFile: (f: File) => void; hasFile: boolean; onRemove: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex shrink-0 gap-1">
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
      <button className="rounded-md border border-[var(--dm-line)] px-2 py-1 text-xs" onClick={() => ref.current?.click()} disabled={busy}>
        {busy ? '…' : hasFile ? 'Thay' : 'Tải lên'}
      </button>
      {hasFile && <button className="rounded-md border border-[var(--dm-line)] px-2 py-1 text-xs text-red-600" onClick={onRemove}>Xóa</button>}
    </div>
  );
}
