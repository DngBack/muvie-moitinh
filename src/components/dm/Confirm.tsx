'use client';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

interface Opts { title?: string; message: React.ReactNode; ok?: string; cancel?: string; danger?: boolean }
type Ask = (o: Opts) => Promise<boolean>;
const Ctx = createContext<Ask>(async () => false);

/** Hộp xác nhận tự dựng (không dùng window.confirm). */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<Opts | null>(null);
  const resolver = useRef<(v: boolean) => void>();
  const ask = useCallback<Ask>((o) => new Promise((res) => { resolver.current = res; setOpts(o); }), []);
  const close = (v: boolean) => { resolver.current?.(v); setOpts(null); };
  return (
    <Ctx.Provider value={ask}>
      {children}
      {opts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6" onClick={() => close(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {opts.title && <h3 className="mb-2 text-lg font-bold">{opts.title}</h3>}
            <div className="text-[15px] leading-relaxed text-[var(--dm-ink)]">{opts.message}</div>
            <div className="mt-5 flex gap-3">
              <button className="flex-1 rounded-lg border border-[var(--dm-line)] py-2.5 font-semibold" onClick={() => close(false)}>{opts.cancel ?? 'Hủy'}</button>
              <button className={`flex-1 rounded-lg py-2.5 font-semibold text-white ${opts.danger ? 'bg-red-600' : 'bg-[var(--dm-pink)]'}`} onClick={() => close(true)}>{opts.ok ?? 'Tiếp tục'}</button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export const useConfirm = () => useContext(Ctx);
