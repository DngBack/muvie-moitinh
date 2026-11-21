'use client';
/**
 * Bộ phát âm thanh của DM — sống ở cấp trang phòng nên chuyển tab không bị ngắt nhạc.
 *  - BGM: lặp, chuyển bài có fade.
 *  - Âm thanh/giọng: phát một lần (BGM tự hạ nhỏ trong lúc phát).
 *  - Giọng chưa có file: mở bảng văn bản để DM đọc / đọc bằng giọng máy (vi-VN).
 *  - Video: mở trình phát toàn màn hình (để trình chiếu lên TV/máy chiếu).
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CUES, cueById, type Cue } from '@/content/audioCues';

interface Engine {
  play: (id: string) => void;
  stopBgm: () => void;
  stopSfx: () => void;
  stopAll: () => void;
  bgm: string | null;
  sfx: string | null;
  volume: number;
  setVolume: (v: number) => void;
  hasFile: (id: string) => boolean;
}

const Ctx = createContext<Engine | null>(null);
export const useAudio = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAudio ngoài AudioProvider');
  return c;
};

export function AudioProvider({ urlOf, children }: { urlOf: (key: string) => string | null; children: React.ReactNode }) {
  const bgmEl = useRef<HTMLAudioElement | null>(null);
  const sfxEl = useRef<HTMLAudioElement | null>(null);
  const [bgm, setBgm] = useState<string | null>(null);
  const [sfx, setSfx] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.9);
  const [voicePanel, setVoicePanel] = useState<Cue | null>(null);
  const [video, setVideo] = useState<{ cue: Cue; url: string | null } | null>(null);
  const fadeTimer = useRef<number | null>(null);
  const volRef = useRef(volume);

  useEffect(() => {
    bgmEl.current = new Audio();
    bgmEl.current.loop = true;
    bgmEl.current.preload = 'auto';
    sfxEl.current = new Audio();
    sfxEl.current.preload = 'auto';
    const s = sfxEl.current;
    const onEnd = () => {
      setSfx(null);
      if (bgmEl.current) bgmEl.current.volume = volRef.current;
    };
    s.addEventListener('ended', onEnd);
    return () => {
      s.removeEventListener('ended', onEnd);
      bgmEl.current?.pause();
      sfxEl.current?.pause();
    };
  }, []);

  const setVolume = useCallback((v: number) => {
    volRef.current = v;
    setVolumeState(v);
    if (bgmEl.current) bgmEl.current.volume = sfx ? v * 0.25 : v;
    if (sfxEl.current) sfxEl.current.volume = v;
  }, [sfx]);

  const fadeTo = useCallback((el: HTMLAudioElement, target: number, ms: number, then?: () => void) => {
    if (fadeTimer.current) window.clearInterval(fadeTimer.current);
    const start = el.volume;
    const steps = Math.max(1, Math.round(ms / 40));
    let i = 0;
    fadeTimer.current = window.setInterval(() => {
      i++;
      el.volume = Math.max(0, Math.min(1, start + ((target - start) * i) / steps));
      if (i >= steps) {
        if (fadeTimer.current) window.clearInterval(fadeTimer.current);
        then?.();
      }
    }, 40);
  }, []);

  const stopBgm = useCallback(() => {
    const el = bgmEl.current;
    if (!el) return;
    fadeTo(el, 0, 600, () => { el.pause(); setBgm(null); });
  }, [fadeTo]);

  const stopSfx = useCallback(() => {
    sfxEl.current?.pause();
    setSfx(null);
    if (bgmEl.current) bgmEl.current.volume = volRef.current;
    window.speechSynthesis?.cancel();
  }, []);

  const stopAll = useCallback(() => { stopSfx(); stopBgm(); }, [stopBgm, stopSfx]);

  const play = useCallback((id: string) => {
    const cue = cueById(id);
    if (!cue) return;
    const url = urlOf(cue.key);

    if (cue.kind === 'video') { setVideo({ cue, url }); return; }

    if (cue.kind === 'bgm') {
      const el = bgmEl.current;
      if (!el) return;
      if (!url) { setVoicePanel({ ...cue, script: [`Chưa có file cho “${cue.name}” — hãy phát bài này từ thiết bị/loa của bạn.`] }); return; }
      const start = () => {
        el.src = url;
        el.currentTime = 0;
        el.volume = 0;
        el.play().catch(() => {});
        setBgm(cue.id);
        fadeTo(el, volRef.current, 900);
      };
      if (!el.paused && bgm) fadeTo(el, 0, 500, start);
      else start();
      return;
    }

    // voice / sfx
    if (!url) { setVoicePanel(cue); return; }
    const s = sfxEl.current;
    if (!s) return;
    s.src = url;
    s.currentTime = 0;
    s.volume = volRef.current;
    s.play().catch(() => {});
    setSfx(cue.id);
    if (bgmEl.current && !bgmEl.current.paused) bgmEl.current.volume = volRef.current * 0.25;
  }, [urlOf, fadeTo, bgm]);

  const hasFile = useCallback((id: string) => {
    const c = cueById(id);
    return !!(c && urlOf(c.key));
  }, [urlOf]);

  return (
    <Ctx.Provider value={{ play, stopBgm, stopSfx, stopAll, bgm, sfx, volume, setVolume, hasFile }}>
      {children}
      {voicePanel && <VoicePanel cue={voicePanel} onClose={() => { window.speechSynthesis?.cancel(); setVoicePanel(null); }} />}
      {video && <VideoPanel cue={video.cue} url={video.url} onClose={() => setVideo(null)} onPauseBgm={stopBgm} />}
    </Ctx.Provider>
  );
}

function VoicePanel({ cue, onClose }: { cue: Cue; onClose: () => void }) {
  const [speaking, setSpeaking] = useState(false);
  const canTts = typeof window !== 'undefined' && 'speechSynthesis' in window && cue.kind === 'voice';

  function speak() {
    const synth = window.speechSynthesis;
    synth.cancel();
    const voices = synth.getVoices();
    const vi = voices.find((v) => v.lang?.toLowerCase().startsWith('vi'));
    (cue.script ?? []).forEach((t, i, arr) => {
      const u = new SpeechSynthesisUtterance(t);
      u.lang = 'vi-VN';
      if (vi) u.voice = vi;
      u.rate = 0.95;
      if (i === arr.length - 1) u.onend = () => setSpeaking(false);
      synth.speak(u);
    });
    setSpeaking(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div className="max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="blk-music text-sm font-semibold">♪ {cue.no} · {cue.name}{cue.original ? ` (${cue.original})` : ''}</p>
        <p className="mt-1 text-xs text-[var(--dm-mute)]">{cue.kind === 'voice' ? 'Chưa có file âm thanh — đọc trực tiếp hoặc dùng giọng máy.' : ''}</p>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed">
          {(cue.script ?? []).map((t, i) => <p key={i} className="blk-line">{t}</p>)}
        </div>
        <div className="mt-5 flex gap-3">
          {canTts && (
            <button className="flex-1 rounded-lg bg-[var(--dm-pink)] py-2.5 font-semibold text-white" onClick={speaking ? () => { window.speechSynthesis.cancel(); setSpeaking(false); } : speak}>
              {speaking ? '■ Dừng đọc' : '▶ Đọc bằng giọng máy'}
            </button>
          )}
          <button className="flex-1 rounded-lg border border-[var(--dm-line)] py-2.5 font-semibold" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

function VideoPanel({ cue, url, onClose, onPauseBgm }: { cue: Cue; url: string | null; onClose: () => void; onPauseBgm: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (url) onPauseBgm(); }, [url, onPauseBgm]);
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm">{cue.name}</span>
        <div className="flex gap-2">
          {url && <button className="rounded bg-white/15 px-3 py-1 text-sm" onClick={() => ref.current?.requestFullscreen?.()}>Toàn màn hình</button>}
          <button className="rounded bg-white/15 px-3 py-1 text-sm" onClick={onClose}>Đóng</button>
        </div>
      </div>
      {url ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video ref={ref} src={url} controls autoPlay playsInline className="min-h-0 flex-1 bg-black" />
      ) : (
        <div className="flex flex-1 items-center justify-center px-8 text-center text-white/70">
          Chưa có video “Tin tức Giang Thành” — hãy phát từ thiết bị của bạn.
        </div>
      )}
    </div>
  );
}

export { CUES };
