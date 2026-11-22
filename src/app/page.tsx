import { PlayerApp } from '@/components/player/PlayerApp';

/**
 * Trang chính = màn vào game của người chơi: nhập mã phòng + chọn nhân vật.
 * Link DM gửi: /?code=12345678 (mã tự điền sẵn). Đã vào rồi thì mở lại là về đúng chỗ.
 */
export default function Home() {
  return <PlayerApp routeSlot={null} />;
}
