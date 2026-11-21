'use client';
export type CheckPayload =
  | { kind: 'l1' | 'l2'; slot: number; answer: string }
  | { kind: 'sec'; slot: number; q: number; answer: string }
  | { kind: 'head' | 'weapon'; answer: string };

export async function checkAnswer(p: CheckPayload): Promise<{ ok: boolean; used?: boolean }> {
  const res = await fetch('/api/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p),
  });
  if (!res.ok) throw new Error('Không kết nối được máy chủ');
  return res.json();
}
