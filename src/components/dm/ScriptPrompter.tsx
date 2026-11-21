'use client';
import { useEffect, useRef, useState } from 'react';
import { DM_STEPS, type Block } from '@/content/dmScript';
import { cueById } from '@/content/audioCues';
import { LOOKUP } from '@/content/lookup';
import { useAudio } from './AudioEngine';
import { STAGE_LABEL } from './StageControl';
import type { Room, StageKey } from '@/lib/types';

export function ScriptPrompter({
  room, step, onStep, onOpen, onLookup,
}: {
  room: Room;
  step: number;
  onStep: (n: number) => void;
  onOpen: (k: StageKey) => void;
  onLookup: (id: string) => void;
}) {
  const audio = useAudio();
  const s = DM_STEPS[Math.min(Math.max(step, 0), DM_STEPS.length - 1)];
  const top = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  useEffect(() => { top.current?.scrollIntoView({ block: 'start' }); }, [step]);

  function render(b: Block, i: number) {
    switch (b.t) {
      case 'action':
        return <div key={i} className="blk-action rounded-md px-3 py-2.5 text-[15px] leading-relaxed">{b.text}</div>;
      case 'warn':
        return <div key={i} className="blk-warn rounded-md px-3 py-2.5 text-[15px] leading-relaxed">{b.text}</div>;
      case 'note':
        return <p key={i} className="text-sm leading-relaxed text-[var(--dm-mute)]">{b.text}</p>;
      case 'list':
        return <ul key={i} className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">{b.items.map((t, j) => <li key={j}>{t}</li>)}</ul>;
      case 'line':
        return (
          <div key={i}>
            {b.who && <p className="text-xs font-semibold uppercase tracking-wide text-[var(--dm-done)]">{b.who}</p>}
            <p className="blk-line text-[16px] leading-[1.75]">“{b.text}”</p>
          </div>
        );
      case 'music': {
        const cue = cueById(b.cue);
        if (!cue) return null;
        const playing = audio.bgm === cue.id || audio.sfx === cue.id;
        return (
          <div key={i} className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50/60 px-3 py-2">
            <div className="blk-music flex-1 text-[15px] font-semibold">
              【{cue.kind === 'bgm' ? 'Phát nhạc nền' : cue.kind === 'video' ? 'Phát video' : 'Phát âm thanh'} {cue.no === 'news' ? '' : cue.no + ': '}{cue.name}】
              {b.text && <span className="block text-xs font-normal text-red-500/80">{b.text}</span>}
            </div>
            <button
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${playing ? 'bg-red-600 text-white' : 'border border-red-400 text-red-600'}`}
              onClick={() => (playing ? (cue.kind === 'bgm' ? audio.stopBgm() : audio.stopSfx()) : audio.play(cue.id))}
            >
              {playing ? '■ Dừng' : '▶ Phát'}
            </button>
          </div>
        );
      }
      case 'open': {
        const opened = room.stage[b.stage];
        return (
          <div key={i} className="flex items-center gap-3 rounded-md border border-pink-200 bg-pink-50/70 px-3 py-2">
            <div className="flex-1 text-[15px]">
              <span className="font-semibold">Mở “{STAGE_LABEL[b.stage]}” trên app</span>
              {b.text && <span className="block text-xs text-[var(--dm-mute)]">{b.text}</span>}
            </div>
            {opened ? (
              <span className="dm-btn-done rounded-[3px] px-2 py-1 text-sm">Đã mở</span>
            ) : (
              <button className="dm-btn-open rounded-[3px] px-3 py-1 text-sm font-semibold" onClick={() => onOpen(b.stage)}>Mở</button>
            )}
          </div>
        );
      }
      case 'qa':
        return (
          <div key={i} className="dm-card px-3 py-2.5">
            <p className="text-sm font-semibold text-[var(--dm-ink)]">{b.q}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-emerald-800">→ {b.a}</p>
            {b.src && <p className="mt-1 text-xs leading-relaxed text-[var(--dm-mute)]">Nguồn: {b.src}</p>}
          </div>
        );
    }
  }

  const lk = s.lookup ? LOOKUP.find((l) => l.id === s.lookup) : null;

  return (
    <div className="pb-28">
      <div ref={top} />
      <div className="sticky top-0 z-10 border-b border-[var(--dm-line)] bg-white/95 px-4 py-2 backdrop-blur">
        <button className="flex w-full items-center justify-between text-left" onClick={() => setMenu((m) => !m)}>
          <span>
            <span className="block text-xs text-[var(--dm-mute)]">{s.part} · Bước {step + 1}/{DM_STEPS.length}{s.time ? ` · ⏱ ${s.time}` : ''}</span>
            <span className="block font-bold">{s.title}</span>
          </span>
          <span className="text-[var(--dm-mute)]">{menu ? '▲' : '▼'}</span>
        </button>
        {menu && (
          <div className="mt-2 max-h-[55dvh] overflow-y-auto rounded-lg border border-[var(--dm-line)]">
            {DM_STEPS.map((x, i) => (
              <button
                key={x.id}
                onClick={() => { onStep(i); setMenu(false); }}
                className={`block w-full border-b border-[var(--dm-line)] px-3 py-2 text-left text-sm last:border-0 ${i === step ? 'bg-pink-50 font-semibold text-[var(--dm-pink)]' : ''}`}
              >
                <span className="text-xs text-[var(--dm-mute)]">{x.part}</span><br />{i + 1}. {x.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 px-4 pt-4">
        {s.blocks.map(render)}
        {lk && (
          <button onClick={() => onLookup(lk.id)} className="mt-2 w-full rounded-md border border-dashed border-[var(--dm-done)] px-3 py-2 text-sm text-[var(--dm-done)]">
            📖 Tra cứu: {lk.title}
          </button>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-[68px] z-10 mx-auto flex max-w-2xl gap-3 bg-gradient-to-t from-white via-white to-transparent px-4 pb-2 pt-4">
        <button className="flex-1 rounded-lg border border-[var(--dm-line)] bg-white py-2.5 font-semibold disabled:opacity-40" disabled={step === 0} onClick={() => onStep(step - 1)}>‹ Bước trước</button>
        <button className="flex-1 rounded-lg bg-[var(--dm-pink)] py-2.5 font-semibold text-white disabled:opacity-40" disabled={step >= DM_STEPS.length - 1} onClick={() => onStep(step + 1)}>Bước tiếp ›</button>
      </div>
    </div>
  );
}

export function LookupPanel({ focus }: { focus: string | null }) {
  const [q, setQ] = useState('');
  const refs = useRef<Record<string, HTMLDetailsElement | null>>({});
  useEffect(() => {
    if (focus && refs.current[focus]) {
      refs.current[focus]!.open = true;
      refs.current[focus]!.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [focus]);

  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  const nq = norm(q.trim());
  const sections = LOOKUP.map((s) => {
    if (!nq) return s;
    const rows = s.rows?.filter(([a, b]) => norm(a + ' ' + b).includes(nq));
    const paras = s.paras?.filter((p) => norm(p).includes(nq));
    const titleHit = norm(s.title).includes(nq);
    if (titleHit) return s;
    if ((rows && rows.length) || (paras && paras.length)) return { ...s, rows, paras };
    return null;
  }).filter(Boolean) as typeof LOOKUP;

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-10 border-b border-[var(--dm-line)] bg-white/95 px-4 py-3 backdrop-blur">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm: tên, manh mối, đáp án… (gõ không dấu được)"
          className="w-full rounded-lg border border-[var(--dm-line)] px-3 py-2 text-[15px] outline-none focus:border-[var(--dm-pink)]"
        />
      </div>
      <div className="space-y-3 px-4 pt-3">
        {sections.map((s) => (
          <details key={s.id} ref={(el) => { refs.current[s.id] = el; }} open={!!nq} className="dm-card overflow-hidden">
            <summary className="cursor-pointer select-none bg-[var(--dm-soft)] px-3 py-2.5 font-semibold">{s.title}</summary>
            <div className="divide-y divide-[var(--dm-line)]">
              {s.rows?.map(([a, b], i) => (
                <div key={i} className="px-3 py-2">
                  <p className="text-sm font-semibold text-[var(--dm-done)]">{a}</p>
                  <p className="text-[15px] leading-relaxed">{b}</p>
                </div>
              ))}
              {s.paras?.map((p, i) => <p key={i} className="px-3 py-2 text-[15px] leading-relaxed">{p}</p>)}
            </div>
          </details>
        ))}
        {!sections.length && <p className="py-8 text-center text-sm text-[var(--dm-mute)]">Không tìm thấy.</p>}
      </div>
    </div>
  );
}
