/**
 * Lượt chơi thứ ba — các "giao diện trò chơi" (hội thoại kiểu visual novel).
 * Nội dung được tái dựng theo sổ tay DM mục VIII–IX. Sửa thoải mái lời thoại,
 * chỉ cần giữ đúng mục đích của từng giao diện (ghi ở `purpose`).
 */
import { charBySlot } from './characters';

export type SceneKey = 'path' | 'school' | 'garden' | 'room' | 'field' | 'void';

export interface Line {
  who?: string;
  text: string;
  /** narration: chữ nghiêng trong ngoặc; system: thông báo hệ thống; glitch: rung nhiễu */
  kind?: 'narration' | 'system' | 'glitch' | 'speech';
}

export interface IfaceDef {
  key: 'i1' | 'i2' | 'i3' | 'i4' | 'i5' | 'i6' | 'final';
  no: number | 'Chương cuối';
  title: string;
  purpose: string;
  scene: SceneKey;
  header?: 'warn' | 'error';
  lines: (slot: number) => Line[];
  /** Sau khi đọc xong cần làm gì thêm để "hoàn thành" */
  gate?: 'l2' | 'head' | 'weapon';
}

const N = (text: string): Line => ({ text, kind: 'narration' });
const SYS = (text: string): Line => ({ who: 'Hệ thống', text, kind: 'system' });
const SAY = (who: string, text: string): Line => ({ who, text, kind: 'speech' });
const G = (who: string, text: string): Line => ({ who, text, kind: 'glitch' });

/** Giao diện 1 — mỗi người gặp lại người yêu của mình trong 《Mối Tình Thiên Niên Kỷ 1》 */
const SWEET: Record<number, Line[]> = {
  1: [
    N('(Phòng âm nhạc tầng ba. Nắng chiều rọi qua ô cửa, tiếng đàn piano dừng lại khi bạn bước vào.)'),
    SAY('Trương Văn Tĩnh', 'Lại trốn tiết đến tìm tôi đấy à? Ngồi xuống đi, hôm nay tôi hát cho cậu nghe.'),
    SAY('Trương Văn Tĩnh', 'Thượng Hải à… Tôi không đi nữa. Ở đây có phòng âm nhạc, có cây đàn này, có cậu ngồi nghe — thế là đủ rồi.'),
    N('(Cô ấy mỉm cười, ngón tay lướt trên phím đàn. Bản nhạc ấy không bao giờ kết thúc.)'),
  ],
  2: [
    N('(Dưới chân tòa ký túc xá nhà máy sợi hóa học, ve kêu râm ran. Một cô gái nhỏ nhắn đang chạy về phía bạn, tay cầm hai cốc đá xay.)'),
    SAY('Diệp Bội Bội', 'Này, đứng ngẩn ra đấy làm gì? Tớ tự làm đá xay đậu xanh cho cậu nè!'),
    SAY('Diệp Bội Bội', 'Lần này tớ nếm thử rồi, ngọt lắm, không nhầm đường với muối nữa đâu~'),
    SAY('Diệp Bội Bội', 'Quảng Châu á? Tớ không đi nữa. Bố ở đâu cũng được, tớ chỉ cần ở lại khu tập thể này với cậu thôi.'),
  ],
  3: [
    N('(Quán chè dưới chân tòa nhà khu tập thể. Trời xanh ngắt, mây trắng trôi lững lờ.)'),
    SAY('Hà Hiểu Vân', 'Cậu nhìn kìa, mây hôm nay trắng quá! Đẹp không?'),
    SAY('Hà Hiểu Vân', 'Thâm Quyến hả… thôi, không đi nữa. Bố tớ ở đây, quán chè ở đây, cậu cũng ở đây.'),
    N('(Cô ấy đặt trước mặt bạn một cốc chè đặc trưng của quán. Đá chưa bao giờ tan.)'),
  ],
  4: [
    N('(Sân bóng rổ sau giờ tập. Chàng trai không cao hơn bạn bao nhiêu, mồ hôi còn đọng trên trán.)'),
    SAY('Trần Vệ', 'Hôm nay đội nghỉ sớm, để tớ đưa cậu về nhé. Tiện ghé quán chè mua một cốc đá xay đậu xanh.'),
    SAY('Trần Vệ', 'Tân Cương xa lắm, tớ không đi nữa. Ở đâu có cậu thì ở đó là tự do.'),
    N('(Hai cái bóng in trên nền sân, dài bằng nhau.)'),
  ],
  5: [
    N('(Phòng vẽ trong căn biệt thự phía nam thành phố. Chàng trai cao lớn đặt bút xuống, nhìn bạn rất lâu.)'),
    SAY('Mã Tiểu Quân', 'Ngồi yên nào, tớ đang vẽ cậu. Đừng cười, cười là nét vẽ lại run đấy.'),
    SAY('Mã Tiểu Quân', 'Bắc Kinh? Học viện Mỹ thuật Trung ương à… không thi nữa. Bức tranh đẹp nhất tớ muốn vẽ ở ngay đây rồi.'),
    N('(Trên giá vẽ, khuôn mặt bạn đang dần hiện lên. Bức tranh ấy sẽ không bao giờ khô màu.)'),
  ],
  6: [
    N('(Căn phòng nhỏ trong khu ký túc xá công nhân viên. Có ai đó đang nói chuyện với bạn qua điện thoại, giọng trầm và ấm.)'),
    SAY('Trương Chấn', 'Lại gọi cho tớ đấy à? Lần này không im lặng nữa nhé, nói gì đi chứ.'),
    SAY('Trương Chấn', 'Chiết Giang… Mẹ tớ ở đây cũng tốt mà. Tớ không đi đâu cả, cậu muốn nghe tớ nói bao lâu cũng được.'),
    N('(Giọng nói ấy giống hệt như trong ký ức. Bạn không muốn đặt ống nghe xuống.)'),
  ],
};

export const INTERFACES: IfaceDef[] = [
  {
    key: 'i1', no: 1, title: 'Trò chơi ngọt ngào', scene: 'path',
    purpose: 'Cho người chơi thấy thế giới ngọt ngào trong 《Mối Tình Thiên Niên Kỷ 1》 — không ai rời đi, không ai phản bội.',
    lines: (slot) => [
      SYS('Đang tải 《Mối Tình Thiên Niên Kỷ 1》…… 100%'),
      N('(Năm 2000. Mùa hè ở Giang Thành không bao giờ kết thúc. Trong thế giới này, không ai rời đi, cũng không ai phản bội.)'),
      ...SWEET[slot],
      SYS('Mức độ hạnh phúc: 100%. Cảm ơn bạn đã ở lại.'),
    ],
  },
  {
    key: 'i2', no: 2, title: 'Chủ nhân thật sự của nhật ký', scene: 'path', gate: 'l2',
    purpose: 'Đưa người chơi quay lại ô mật khẩu nhật ký để tìm thân phận lớp thứ hai và trả lời câu hỏi bảo mật.',
    lines: () => [
      N('(Hai bạn tay trong tay, đi trên đường về nhà, từng ngọn cỏ, từng cành cây, từng bông hoa, từng gốc cây trên đường đều khiến bạn cảm thấy vô cùng quen thuộc, khung cảnh trong ký ức tựa như một tấm ảnh cũ đã ố vàng, giờ đây từ từ gỡ bỏ lớp kính lọc dày, trở nên rõ ràng.)'),
      N('(Quen thuộc đến mức… dường như bạn đã đi con đường này từ rất lâu trước kia, với một cái tên khác.)'),
      N('(Bỗng nhiên, khung cảnh khựng lại. Người bên cạnh đứng im như một bức tượng.)'),
      SYS('Phát hiện ký ức của người dùng không khớp với chủ nhân không gian nhật ký.'),
      SYS('Vui lòng xác minh lại mật khẩu riêng của không gian nhật ký.'),
    ],
  },
  {
    key: 'i3', no: 3, title: 'Đảo chiều cái chết của Tiếu Tiếu', scene: 'school', header: 'warn',
    purpose: 'NPC thức tỉnh, tố cáo người chơi; gợi ý rằng cái chết của Tiếu Tiếu còn có những người khác nhúng tay.',
    lines: (slot) => {
      const c = charBySlot(slot);
      return [
        N('(Màn hình nhiễu sóng dữ dội. Người yêu của bạn chầm chậm quay đầu lại, ánh mắt trở nên xa lạ.)'),
        G(c.lover, `Mùa hè năm đó, các người đã vu cáo với nhà trường về mối quan hệ yêu đương giữa tôi và ${c.loverPair}…`),
        G(c.lover, 'Bị đuổi học rồi, chúng tôi còn chưa kịp hiểu chuyện gì, thì các người đã đến tìm chúng tôi.'),
        G(c.lover, 'Các người nói: chỉ có cách này mới giữ được nhau mãi mãi.'),
        G('NPC', 'Nhưng mọi chuyện đâu bắt đầu từ chúng tôi.'),
        G('NPC', 'Ngày 5 tháng 6 năm 1999, tòa nhà dạy học, trời mưa…'),
        G('NPC', 'Tiếu Tiếu thật sự chết dưới tay Tưởng Văn sao?'),
        G('NPC', 'Hôm đó, các người cũng ở trong tòa nhà dạy học mà. Các người đã làm gì trong từng căn phòng?'),
        SYS('⚠ Cảnh báo: NPC thức tỉnh ý thức, cốt truyện đi chệch hướng.'),
      ];
    },
  },
  {
    key: 'i4', no: 4, title: 'Phá vỡ chiều không gian — tìm nơi giấu đầu', scene: 'school', header: 'warn', gate: 'head',
    purpose: 'Người chơi suy luận nơi giấu đầu của Tiếu Tiếu (đáp án: vườn hoa hồng nhà Hoan Hoan).',
    lines: (slot) => {
      const c = charBySlot(slot);
      return [
        N('(Đèn trong phòng vụt tắt. Chỉ còn ánh nến tín hiệu và màn hình trước mặt bạn.)'),
        G(c.lover, '…các người vốn đã có kinh nghiệm cùng nhau mưu sát, giết thêm vài người nữa thì có gì khó đâu.'),
        G(c.lover, 'Thi thể Tiếu Tiếu nằm trong phòng y tế. Nhưng chiếc đầu thì sao?'),
        G(c.lover, 'Hai mươi năm rồi, cảnh sát chưa từng tìm thấy nó.'),
        G('NPC', 'Người đã mang nó đi… sẽ đặt nó ở đâu?'),
        SYS('Nhiệm vụ mới: Tìm nơi cất giấu đầu của Tiếu Tiếu.'),
      ];
    },
  },
  {
    key: 'i5', no: 5, title: 'Hé lộ bí mật của chiếc đầu', scene: 'garden', header: 'warn', gate: 'weapon',
    purpose: 'Tìm thấy chiếc đầu; người chơi xác định hung khí (lưỡi dao trên giày trượt băng).',
    lines: () => [
      N('(Các bạn đến khu vườn trồng đầy hoa hồng của nhà Hoan Hoan, hoa hồng nở rộ kiều diễm khác thường.)'),
      N('(Đào lớp đất bên dưới gốc hoa hồng lên, bên trong rõ ràng là một chiếc đầu người tròn lẳn!)'),
      N('(Trên khuôn mặt trắng bệch đầy những vết máu lấm tấm, sau gáy có một vết dao sâu đến tận xương, thẳng tắp, dường như không phải do loại dao thường thấy trên thị trường gây ra.)'),
      SYS('Nhiệm vụ mới: Xác định hung khí.'),
    ],
  },
  {
    key: 'i6', no: 6, title: 'Tưởng Văn xuất hiện', scene: 'room', header: 'error',
    purpose: 'Chương trình lạ thay thế NPC — mở màn cho phần diễn của Tưởng Văn (DM).',
    lines: () => [
      N('(Màn hình chớp tắt liên hồi. Mọi nhân vật trong trò chơi đồng loạt quay đầu, nhìn thẳng về phía các bạn.)'),
      SYS('✖ Error — Phát hiện chương trình lạ đã thay thế NPC của lượt chơi này.'),
      SYS('Mã AI không xác định đang ghi đè cốt truyện…… 37%…… 81%…… 100%.'),
      N('(Trong căn phòng cũ, chiếc quạt trần quay chầm chậm. Một cô gái ngồi bên mép giường, quay lưng về phía các bạn.)'),
      G('???', 'Đầu đã tìm thấy. Hung khí cũng đã tìm thấy.'),
      G('???', 'Hai mươi năm… cuối cùng cũng đến ngày hôm nay.'),
      G('???', 'Chúng ta đã thành công chưa?'),
      N('(Hãy ngẩng đầu lên. Người dẫn trò đang nhìn bạn.)'),
    ],
  },
];

export const FINALE: IfaceDef = {
  key: 'final', no: 'Chương cuối', title: 'Chương cuối của trò chơi', scene: 'field',
  purpose: 'Hoan Hoan trao cho người chơi quyền quyết định đóng hay tiếp tục trò chơi.',
  lines: () => [
    SYS('Chương cuối của trò chơi đã tải xong.'),
    N('(Trên màn hình xuất hiện khuôn mặt của Hoan Hoan, cô ấy đang đứng giữa một cánh đồng hoa hồng ở Đan Mạch.)'),
    SAY('Hoan Hoan', 'Các cậu, đã lâu không gặp.'),
    SAY('Hoan Hoan', 'Nếu các cậu nhìn thấy đoạn này, nghĩa là các cậu đã đi hết con đường của năm Thiên Hy Niên một lần nữa — và đã biết toàn bộ sự thật.'),
    SAY('Hoan Hoan', 'Tớ ở đây rồi. Ở Đan Mạch trong trò chơi, hoa hồng nở quanh năm, và Tiếu Tiếu đang đứng ngay bên cạnh tớ. Chúng tớ đã có hôn lễ của riêng mình.'),
    SAY('Hoan Hoan', '《Mối Tình Thiên Niên Kỷ 1》 cho các cậu gặp lại người mình yêu. Nhưng nó cũng nhốt các cậu lại, nhốt cả những người đã không thể lớn lên.'),
    SAY('Hoan Hoan', 'Tớ đã chọn ở lại. Còn các cậu — tớ không có quyền chọn thay.'),
    SAY('Hoan Hoan', 'Mỗi người các cậu đang giữ một ngọn đèn tín hiệu. Chỉ khi tất cả các ngọn đèn đều tắt, trò chơi mới đóng lại mãi mãi. Chỉ cần còn một ngọn đèn sáng, trò chơi sẽ tiếp tục vận hành.'),
    SAY('Hoan Hoan', 'Tình yêu là lồng giam, hay là tự do? Lần này, hãy để chính các cậu trả lời.'),
    SAY('Hoan Hoan', 'Và cô bé ấy — đóa hồng mọc ngược sáng — xin các cậu, hãy để con bé được tự mình nở hoa.'),
    N('(Hình ảnh Hoan Hoan mờ dần giữa biển hoa hồng.)'),
    SYS('Hãy bàn bạc với mọi người, rồi đưa ra lựa chọn bằng ngọn đèn tín hiệu của bạn.'),
  ],
};

export function ifaceByKey(key: string): IfaceDef | undefined {
  return key === 'final' ? FINALE : INTERFACES.find((i) => i.key === key);
}

/** Câu hỏi + gợi ý nhẹ cho các cổng trả lời (đáp án được chấm trên server). */
export const GATES = {
  head: {
    question: 'Đầu của Tiếu Tiếu bây giờ đang ở đâu?',
    hints: [
      'Gợi ý: Nơi đó chắc chắn là nơi Hoan Hoan quen thuộc.',
      'Gợi ý: …hoặc là nơi cô ấy từng hứa hẹn điều gì đó với Tiếu Tiếu (Thư của Hoan Hoan — trang 2 và trang 7).',
    ],
  },
  weapon: {
    question: 'Vết dao sau gáy Tiếu Tiếu do hung khí gì gây ra?',
    hints: [
      'Gợi ý: Không phải loại dao thường thấy trên thị trường.',
      'Gợi ý: Hãy nhớ lại tiểu chương 【Hoan Hoan và Tiếu Tiếu】 trong Nhật ký 1, và trang 9 Thư của Hoan Hoan.',
    ],
  },
} as const;
