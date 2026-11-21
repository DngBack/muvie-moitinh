import { notFound } from 'next/navigation';
import { PlayerApp } from '@/components/player/PlayerApp';

export const metadata = { title: 'Thiên Hy Niên 2.0' };

/** QR ở trang đầu mỗi kịch bản trỏ về /p/1 … /p/6 */
export default function PlayerSlot({ params }: { params: { slot: string } }) {
  const n = Number(params.slot);
  if (!Number.isInteger(n) || n < 1 || n > 6) notFound();
  return <PlayerApp routeSlot={n} />;
}
