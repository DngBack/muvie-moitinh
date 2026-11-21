import { NextResponse } from 'next/server';
import { containsKeyword, sameName } from '@/lib/normalize';
import { GATE_KEYWORDS, NAME_L1, NAME_L2, SECURITY_KEYWORDS } from '@/server/answers';

export const dynamic = 'force-dynamic';

type Body =
  | { kind: 'l1' | 'l2'; slot: number; answer: string }
  | { kind: 'sec'; slot: number; q: number; answer: string }
  | { kind: 'head' | 'weapon'; answer: string };

/** Chấm đáp án trên server. Trả { ok, kind } — với l2 còn báo "used" nếu người chơi nhập lại tên lớp 1. */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }
  const answer = String((body as { answer?: unknown }).answer ?? '').slice(0, 200);
  if (!answer.trim()) return NextResponse.json({ ok: false });

  switch (body.kind) {
    case 'l1': {
      const list = NAME_L1[body.slot] ?? [];
      return NextResponse.json({ ok: list.some((n) => sameName(n, answer)) });
    }
    case 'l2': {
      const ok = (NAME_L2[body.slot] ?? []).some((n) => sameName(n, answer));
      const used = !ok && (NAME_L1[body.slot] ?? []).some((n) => sameName(n, answer));
      return NextResponse.json({ ok, used });
    }
    case 'sec': {
      const kws = SECURITY_KEYWORDS[body.slot]?.[body.q - 1] ?? [];
      return NextResponse.json({ ok: containsKeyword(answer, kws) });
    }
    case 'head':
    case 'weapon':
      return NextResponse.json({ ok: containsKeyword(answer, GATE_KEYWORDS[body.kind]) });
    default:
      return NextResponse.json({ ok: false, error: 'bad_kind' }, { status: 400 });
  }
}
