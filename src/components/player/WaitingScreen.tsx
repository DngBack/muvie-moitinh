'use client';
import { Scene, type AnyScene } from '../Scene';

export function WaitingScreen({
  title, sub, loading, scene, bgUrl, children,
}: {
  title: string;
  sub?: string;
  loading?: boolean;
  scene?: AnyScene;
  bgUrl?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <main className="qq-screen">
      {scene && <Scene scene={scene} imageUrl={bgUrl} className="opacity-40" />}
      <div className="qq-inner mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-8 text-center">
        <div className="mb-6 flex h-16 w-14 items-center justify-center rounded-sm border-2 border-white/60 bg-[#5b2b3c] shadow-[4px_4px_0_rgba(0,0,0,.5)]">
          <span className="qq-pixel text-2xl">≡</span>
        </div>
        <h1 className="qq-title text-xl leading-snug">{title}</h1>
        {loading && (
          <div className="mt-5 h-2 w-56 overflow-hidden rounded bg-white/10">
            <div className="loading-bar h-full bg-gradient-to-r from-pink-400 to-fuchsia-500" />
          </div>
        )}
        {sub && <p className="mt-4 text-sm leading-relaxed text-[var(--qq-mute)]">{sub}</p>}
        {children}
      </div>
    </main>
  );
}
