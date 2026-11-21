/**
 * Phòng chat OICQ "Tinh Anh Thiên Hy" — Lượt chơi thứ nhất.
 *
 * Mỗi người chơi chỉ nhìn thấy MỘT đoạn hội thoại khác nhau (lúc mình đang online),
 * nên phải chia sẻ phòng chat với nhau mới tìm ra "họ tên" của mình.
 *
 * ⚠ Các câu được đánh dấu // MANH MỐI là câu sổ tay DM trích dẫn để khôi phục —
 *   sửa thì phải giữ nguyên ý, nếu không logic suy luận sẽ gãy.
 *
 * Logic khôi phục (sổ tay mục II):
 *  - Đá Xay Đậu Xanh = Trương Chấn  ← ảnh đại diện tất đen (log Dây Tết Hoa) + "màu cô ấy thích ngược với tớ"
 *                                     + Bi Thủy Tinh thích mây trắng, ghét Trương Chấn mặc đồ đen (log Bi Thủy Tinh)
 *  - Bi Thủy Tinh   = Hà Hiểu Vân   ← cùng chuỗi trên
 *  - Tranh Cát      = Mã Tiểu Quân  ← Mã Tiểu Quân vẽ ở phòng mỹ thuật (log Đá Xay Đậu Xanh) + Tranh Cát đi Cung Thiếu nhi luyện vẽ (log Đất Nặn)
 *  - Dây Tết Hoa    = Diệp Bội Bội  ← cô bé bán dây tết hoa thấp (log Băng Cát-xét) + Diệp Bội Bội rất thấp (log Đất Nặn)
 *  - Đất Nặn        = Trần Vệ       ← Trần Vệ dẫn đội bóng (log Tranh Cát) + ban ngày tập luyện (log Đá Xay Đậu Xanh) + tự off đi tập (log Đất Nặn)
 *  - Băng Cát-xét   = Trương Văn Tĩnh ← Trương Văn Tĩnh yêu âm nhạc (log Bi Thủy Tinh) + tự off đến phòng âm nhạc (log Băng Cát-xét)
 */

export type ChatEntry =
  | { t: 'msg'; who: string; text: string }
  | { t: 'sys'; text: string }
  | { t: 'time'; text: string };

const S = (text: string): ChatEntry => ({ t: 'sys', text });
const M = (who: string, text: string): ChatEntry => ({ t: 'msg', who, text });

export const CHAT_LOGS: Record<number, ChatEntry[]> = {
  // ─────────────────────────── 1. TRANH CÁT ───────────────────────────
  1: [
    { t: 'time', text: 'Thứ Bảy 14:02' },
    M('Hoan Hoan', 'Tháng sau đội trượt băng có buổi biểu diễn ở sân băng thành phố, mọi người nhớ đến cổ vũ nhé ^_^'),
    M('Tiếu Tiếu', 'Đứa nào không đến thì chị cho vào danh sách đen OICQ luôn đấy!'),
    M('Dây Tết Hoa', 'Em đến em đến! Em còn tết sẵn một chùm dây hoa để ném lên sân băng nữa'),
    M('Bi Thủy Tinh', 'Tranh Cát, có phải cậu lại trốn trong phòng vẽ không đấy? Gọi mãi chẳng thấy trả lời'),
    // MANH MỐI — Trần Vệ dẫn đội bóng của trường tập luyện
    M('Tranh Cát', 'Đâu dám chứ, tớ vừa thấy Trần Vệ trên sân vận động của trường, cậu ta đang dẫn đội bóng của trường tập luyện đấy, phải nói là cậu ấm được nuông chiều từ nhỏ này chơi bóng cũng ra trò phết'),
    // MANH MỐI (đảo chiều vụ án) — nhìn thấy người ra vào nhà Trần Vệ
    M('Tranh Cát', 'Mà nhà cậu ta ngay đối diện cửa sổ phòng vẽ nhà tớ ở khu biệt thự phía nam, ai ra ai vào tớ đều nhìn thấy hết, chẳng giấu được gì đâu'),
    M('Dây Tết Hoa', 'Á! Cậu rình nhà người ta đấy à?'),
    M('Tranh Cát', 'Tớ vẽ phong cảnh! Phong cảnh!!'),
    M('Tiếu Tiếu', 'Ha ha ha, phong cảnh có chân biết đi ra đi vào cơ à'),
    M('Hoan Hoan', 'Thôi tha cho cậu ấy đi, người ta là họa sĩ tương lai đấy'),
    M('Tranh Cát', 'Tớ off đây, bức tranh hôm qua còn chưa vẽ xong'),
    S('[Tranh Cát] rời phòng chat'),
  ],

  // ─────────────────────────── 2. ĐÁ XAY ĐẬU XANH ───────────────────────────
  2: [
    { t: 'time', text: 'Thứ Bảy 15:17' },
    M('Đá Xay Đậu Xanh', 'Có ai online không? Kể cho nghe một chuyện chấn động đây'),
    M('Đất Nặn', 'Nói mau nói mau'),
    // MANH MỐI — Mã Tiểu Quân vẽ tranh
    M('Đá Xay Đậu Xanh', 'Anh nghe chuyện của Mã Tiểu Quân chưa? Tối qua, cậu ta ở phòng mỹ thuật của trường vẽ chân dung khỏa thân cho bạn nữ cùng trường…..'),
    M('Đất Nặn', 'Thật á?? Dân mỹ thuật đúng là khác người'),
    M('Tiếu Tiếu', 'Mấy đứa con trai các em toàn quan tâm mấy chuyện linh tinh! Lo mà ôn thi đi'),
    M('Hoan Hoan', 'Mà Đất Nặn này, hôm qua cậu lại rủ người ta đi xem phim đêm à?'),
    M('Đất Nặn', 'Phim hay thì xem thôi mà ^_^'),
    // MANH MỐI — Đất Nặn ban ngày tập luyện
    M('Đá Xay Đậu Xanh', 'Khó cho cậu ta sung sức đến vậy, ban ngày phải tập luyện, buổi tối còn phải xem phim, chẳng biết lấy đâu ra sức'),
    // MANH MỐI (vụ án) — cuộc gọi quấy rối
    M('Đá Xay Đậu Xanh', 'À mà kỳ lạ lắm, dạo này cứ đến trưa là có người gọi vào máy bàn nhà tớ, nhấc máy lên thì đầu dây bên kia chẳng nói câu nào, cứ im lặng nghe tớ nói, tớ mắng một trận người ta mới chịu cúp'),
    M('Tiếu Tiếu', 'Chắc là có người mê giọng của em rồi đấy ^_^'),
    M('Đá Xay Đậu Xanh', 'Mê gì mà mê, phiền chết đi được'),
    // MANH MỐI (đảo chiều vụ án) — chợ nông sản Vạn Hâm
    M('Đá Xay Đậu Xanh', 'Sáng nay tớ còn đạp xe ra tận chợ nông sản Vạn Hâm một chuyến, mua ít đồ giúp mẹ, mệt rã rời'),
    M('Hoan Hoan', 'Ngoan thế, về nhà nhớ uống cốc chè cho mát'),
    M('Đá Xay Đậu Xanh', 'Thôi tớ off đây, mẹ gọi xuống ăn cơm rồi'),
    S('[Đá Xay Đậu Xanh] rời phòng chat'),
  ],

  // ─────────────────────────── 3. ĐẤT NẶN ───────────────────────────
  3: [
    { t: 'time', text: 'Thứ Bảy 16:40' },
    M('Đá Xay Đậu Xanh', 'Ơ Tranh Cát đâu rồi? Hôm qua hẹn đánh cờ caro với tớ mà'),
    // MANH MỐI — Tranh Cát luyện vẽ
    M('Tiếu Tiếu', 'Tranh Cát đi Cung Thiếu nhi luyện vẽ rồi…. thằng bé chăm lắm, chiều nào cũng đi'),
    M('Đá Xay Đậu Xanh', 'Lại bỏ bom tớ'),
    M('Đất Nặn', 'Thôi đừng buồn, kể cậu nghe chuyện này còn hay hơn'),
    // MANH MỐI — Diệp Bội Bội rất thấp
    M('Đất Nặn', 'Tối hôm kia, tớ thấy Diệp Bội Bội một mình đi vào cửa hàng đồ người lớn, người thấp như cô ấy đâu có nhiều, tớ đương nhiên không nhìn nhầm được.'),
    M('Bi Thủy Tinh', 'Thật hay đùa đấy? Mà cậu đứng ở đó làm gì mà thấy được?'),
    M('Đất Nặn', 'Tớ… tớ đi ngang qua thôi!'),
    M('Đá Xay Đậu Xanh', 'Đi ngang qua mà nhìn rõ thế cơ à, ha ha ha'),
    M('Hoan Hoan', 'Thôi thôi, đừng lôi chuyện con gái nhà người ta ra nói nữa'),
    // MANH MỐI — bản thân phải ra sân vận động tập luyện
    M('Đất Nặn', 'Tớ off trước đây, còn phải ra sân vận động tập luyện'),
    S('[Đất Nặn] rời phòng chat'),
  ],

  // ─────────────────────────── 4. DÂY TẾT HOA ───────────────────────────
  4: [
    { t: 'time', text: 'Thứ Bảy 11:25' },
    M('Tiếu Tiếu', 'Mấy đứa ăn trưa chưa? Căng tin hôm nay có sườn xào chua ngọt đấy'),
    M('Dây Tết Hoa', 'Chưa ạ, em đang định đi đây! Mà khoan đã…'),
    // MANH MỐI — ảnh đại diện tất đen
    M('Dây Tết Hoa', 'Cậu, cậu, cậu, sao cậu lại đổi ảnh đại diện thành thứ hạ lưu như tất đen thế hả?'),
    M('Đá Xay Đậu Xanh', 'Thì sao, tớ thích màu đen mà, tất đen cũng là màu đen ^_^'),
    // MANH MỐI — màu Hà Hiểu Vân thích ngược với Đá Xay Đậu Xanh
    M('Dây Tết Hoa', 'Mau đổi lại đi! Dù sao nếu Hà Hiểu Vân mà thấy thì sẽ mắng chết cậu cho xem.'),
    M('Đá Xay Đậu Xanh', 'Đúng thế, màu cô ấy thích lúc nào cũng ngược với tớ.'),
    M('Hoan Hoan', 'Hai đứa này hôm nào cũng chí chóe với nhau'),
    M('Tiếu Tiếu', 'Dây Tết Hoa ơi, sườn sắp hết rồi đấy'),
    M('Dây Tết Hoa', 'Á em đi ngay! Mọi người nói chuyện tiếp nhé, em off đi ăn cơm đây!'),
    S('[Dây Tết Hoa] rời phòng chat'),
  ],

  // ─────────────────────────── 5. BI THỦY TINH ───────────────────────────
  5: [
    { t: 'time', text: 'Thứ Bảy 12:48' },
    M('Đất Nặn', 'Trời hôm nay xanh ghê, chiều đi đá cầu không?'),
    // MANH MỐI — thích mây trắng, ghét Trương Chấn mặc đồ đen
    M('Bi Thủy Tinh', 'Lẽ nào các cậu không thích những đám mây trắng khắp bầu trời sao? Mây trắng đẹp biết bao! Trắng tinh, mềm mại, nhìn thôi đã thấy dễ chịu…..'),
    M('Bi Thủy Tinh', 'Chứ không như cái tên Trương Chấn kia vẫn là một bộ đồ đen từ đầu đến chân, đi đâu cũng như con quạ….. ghét chết đi được!'),
    M('Đá Xay Đậu Xanh', 'Mấy hôm nay cứ trưa là có người gọi điện quấy rối nhà tớ, nhấc máy chỉ nghe tiếng thở, chẳng nói gì'),
    // MANH MỐI — Trương Văn Tĩnh yêu âm nhạc
    M('Bi Thủy Tinh', 'Thế thì cậu hát cho người ta nghe luôn đi ha ha. Tớ thấy lần sau chi bằng để cô Trương Văn Tĩnh nghe loại điện thoại quấy rối này, dù sao cô ấy cũng là người yêu âm nhạc nhất'),
    M('Hoan Hoan', 'Ha ha ha ha'),
    M('Đất Nặn', 'Cậu sắp cười chết rồi đấy'),
    M('Bi Thủy Tinh', 'Tớ…… ha ha ha, tớ off trước đây'),
    S('[Bi Thủy Tinh] rời phòng chat'),
  ],

  // ─────────────────────────── 6. BĂNG CÁT-XÉT ───────────────────────────
  6: [
    { t: 'time', text: 'Thứ Bảy 11:52' },
    S('[Băng Cát-xét] vào phòng chat'),
    M('Băng Cát-xét', 'Mọi người đâu cả rồi? Sao hôm nay vắng thế'),
    // MANH MỐI — cô bé bán dây tết hoa thấp
    M('Tiếu Tiếu', 'Là cậu đến muộn thôi, cô bé bán dây tết hoa vừa mới off đi ăn cơm rồi.'),
    M('Băng Cát-xét', 'Bảo cô ấy ăn nhiều vào, không thì chẳng cao lên được đâu.'),
    M('Hoan Hoan', 'Câu này mà để cô ấy nghe thấy là giận cả tuần đấy'),
    M('Tranh Cát', 'Có ai nghe băng mới của Phác Thụ chưa? Bài “Những bông hoa ấy” nghe mà muốn khóc'),
    M('Băng Cát-xét', 'Nghe rồi. Đoạn điệp khúc hòa âm rất đẹp, nhưng thứ đáng nghe nhất vẫn là chất giọng — trầm, ấm, nghe một lần là nhớ mãi.'),
    M('Tiếu Tiếu', 'Đúng là cảm âm tuyệt đối có khác ^_^'),
    // MANH MỐI — đến phòng âm nhạc
    M('Băng Cát-xét', 'Lát nữa tớ còn có tiết, mọi người cứ nói chuyện trước nhé, tớ đến phòng âm nhạc trước đây.'),
    S('[Băng Cát-xét] rời phòng chat'),
  ],
};

/** Phần kết chung của mọi log: kích hoạt hệ thống nhật ký rồi người chơi vào lại phòng chat. */
export function chatTail(nick: string): ChatEntry[] {
  return [
    S('Hệ thống nhật ký đã được kích hoạt…'),
    { t: 'time', text: 'Bây giờ' },
    S(`[${nick}] vào phòng chat`),
  ];
}

export const CHAT_HINTS = [
  'Gợi ý: Mỗi người chỉ nhìn thấy một phần cuộc trò chuyện. Hãy đọc to phòng chat của mình và đối chiếu với mọi người.',
  'Gợi ý: Để ý những chi tiết như màu sắc yêu thích, chiều cao, nơi tập luyện, nơi đến sau khi rời phòng chat…',
  'Gợi ý: Hãy tìm ra LÝ DO vì sao mình là cái tên đó, rồi mới nhập.',
];
