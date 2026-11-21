import type { Slot } from '@/lib/types';

export interface Character {
  slot: Slot;
  /** Biệt danh trong phòng chat / tên kịch bản */
  nick: string;
  gender: 'Nam' | 'Nữ';
  /** Châm ngôn DM đọc khi chọn vai */
  motto: string;
  /** Lớp thân phận thứ nhất (đáp án nhập tên lần đầu) */
  l1: string;
  /** Lớp thân phận thứ hai — chủ nhân thật của nhật ký */
  l2: string;
  /** Người yêu thật của chủ nhân nhật ký (L2) */
  lover: string;
  /** Cặp "loạn luân" bị tố cáo của người yêu (dùng ở Giao diện 3) */
  loverPair: string;
  /** Thân phận thật ngoài đời (hé lộ cuối) */
  real: string;
  color: string;
  /** Ghi chú cho DM */
  dmNote?: string;
}

export const CHARACTERS: Character[] = [
  {
    slot: 1, nick: 'Tranh Cát', gender: 'Nam',
    motto: 'Giữa tả thực và trừu tượng, tôi chọn làm chuyện sắc dục.',
    l1: 'Mã Tiểu Quân', l2: 'Hồng Vũ', lover: 'Trương Văn Tĩnh', loverPair: 'Mã Tiểu Quân',
    real: 'Hồng Vũ', color: '#f2c46d',
  },
  {
    slot: 2, nick: 'Đá Xay Đậu Xanh', gender: 'Nam',
    motto: 'Giải khát hơn trà xanh, mát mẻ cả mùa hè, xua nóng hạ hỏa.',
    l1: 'Trương Chấn', l2: 'Lưu Sấm', lover: 'Diệp Bội Bội', loverPair: 'Trương Chấn',
    real: 'Lưu Sấm', color: '#8fd18b',
  },
  {
    slot: 3, nick: 'Đất Nặn', gender: 'Nam',
    motto: 'Muốn nắn bóp cũng được, nhưng phải cam tâm tình nguyện; gặp người thích thì mềm nhũn, gặp người không thích thì cứng đơ.',
    l1: 'Trần Vệ', l2: 'Lý Bằng', lover: 'Hà Hiểu Vân', loverPair: 'Trần Vệ',
    real: 'Lý Bằng', color: '#f0a58a',
  },
  {
    slot: 4, nick: 'Dây Tết Hoa', gender: 'Nữ',
    motto: 'Trói buộc và quất đánh đều không bỏ lỡ, một sợi dây hai công dụng.',
    l1: 'Diệp Bội Bội', l2: 'Tôn Miêu Miêu', lover: 'Trần Vệ', loverPair: 'Hà Hiểu Vân',
    real: 'Tôn Miêu Miêu', color: '#f49ac1',
  },
  {
    slot: 5, nick: 'Bi Thủy Tinh', gender: 'Nữ',
    motto: 'Bi thủy tinh rất cứng, nhưng còn cứng hơn nó là cái đầu chỉ biết yêu đương của mình.',
    l1: 'Hà Hiểu Vân', l2: 'Hà Lị Lị', lover: 'Mã Tiểu Quân', loverPair: 'Trương Văn Tĩnh',
    real: 'Hà Lị Lị', color: '#7aa2ff',
  },
  {
    slot: 6, nick: 'Băng Cát-xét', gender: 'Nữ',
    motto: 'Cảm âm tuyệt đối, nghe tiếng nhận người, cao thủ buôn điện thoại, đúng phong cách mẹ kế trẻ, cũng có thể là phong cách dì trẻ.',
    l1: 'Trương Văn Tĩnh', l2: 'Phàn Diễm', lover: 'Trương Chấn', loverPair: 'Diệp Bội Bội',
    real: 'Con gái của Tưởng Tiếu Tiếu — “Hoa Hồng” thế hệ thứ ba',
    color: '#c9a0ff',
    dmNote: 'Không đổi giới tính vai. Chọn người chơi nữ phù hợp — cú đảo chiều cuối cùng.',
  },
];

/** Nhân vật NPC trong phòng chat */
export const NPC_COLORS: Record<string, string> = {
  'Tiếu Tiếu': '#ffd166',
  'Hoan Hoan': '#9ad7ff',
};

export function charBySlot(slot: number): Character {
  return CHARACTERS.find((c) => c.slot === slot) ?? CHARACTERS[0];
}

export function colorOfNick(nick: string): string {
  return CHARACTERS.find((c) => c.nick === nick)?.color ?? NPC_COLORS[nick] ?? '#dfe6f5';
}
