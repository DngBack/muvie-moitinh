import { PlayerApp } from '@/components/player/PlayerApp';

export const metadata = { title: 'Thiên Hy Niên 2.0' };

/** QR trong "Thư của Hoan Hoan" trỏ về đây — tự quay về đúng vai đang giữ trên thiết bị. */
export default function PlayerResume() {
  return <PlayerApp routeSlot={null} />;
}
