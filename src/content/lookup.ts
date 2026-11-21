/** Tra cứu nhanh cho DM — tóm tắt từ Sổ tay người dẫn trò. */
export interface LookupSection {
  id: string;
  title: string;
  rows?: [string, string][];
  paras?: string[];
}

export const LOOKUP: LookupSection[] = [
  {
    id: 'identity', title: 'Thân phận các nhân vật',
    rows: [
      ['Thư mời 1 — Tranh Cát (Nam)', 'Bề ngoài: Mã Tiểu Quân · Thực chất: Hồng Vũ'],
      ['Thư mời 2 — Đá Xay Đậu Xanh (Nam)', 'Bề ngoài: Trương Chấn · Thực chất: Lưu Sấm'],
      ['Thư mời 3 — Đất Nặn (Nam)', 'Bề ngoài: Trần Vệ · Thực chất: Lý Bằng'],
      ['Thư mời 4 — Dây Tết Hoa (Nữ)', 'Bề ngoài: Diệp Bội Bội · Thực chất: Tôn Miêu Miêu'],
      ['Thư mời 5 — Bi Thủy Tinh (Nữ)', 'Bề ngoài: Hà Hiểu Vân · Thực chất: Hà Lị Lị'],
      ['Thư mời 6 — Băng Cát-xét (Nữ)', 'Bề ngoài: Trương Văn Tĩnh · Bên trong: Phàn Diễm · Thực chất: con gái Tưởng Tiếu Tiếu (“Hoa Hồng”)'],
      ['DM', 'NPC → đàn chị Tiếu Tiếu (phần nhật ký) → thực chất Tưởng Văn (bệnh kiều, rối loạn sắc giác)'],
    ],
  },
  {
    id: 'names', title: 'Phòng chat — tên đúng & lý do',
    rows: [
      ['Đá Xay Đậu Xanh = Trương Chấn', 'Log Dây Tết Hoa: ảnh đại diện tất đen; “màu cô ấy (Hà Hiểu Vân) thích lúc nào cũng ngược với tớ”. Log Bi Thủy Tinh: thích mây trắng, ghét Trương Chấn đồ đen.'],
      ['Bi Thủy Tinh = Hà Hiểu Vân', 'Cùng chuỗi trên — người thích màu trắng, ghét màu đen.'],
      ['Tranh Cát = Mã Tiểu Quân', 'Log Đá Xay Đậu Xanh: Mã Tiểu Quân vẽ ở phòng mỹ thuật. Log Đất Nặn: Tiếu Tiếu nói Tranh Cát đi Cung Thiếu nhi luyện vẽ.'],
      ['Dây Tết Hoa = Diệp Bội Bội', 'Log Băng Cát-xét: cô bé bán dây tết hoa “ăn nhiều vào, không thì chẳng cao lên được”. Log Đất Nặn: Diệp Bội Bội rất thấp.'],
      ['Đất Nặn = Trần Vệ', 'Log Tranh Cát: Trần Vệ dẫn đội bóng tập. Log Đá Xay Đậu Xanh: ban ngày tập luyện, tối xem phim. Log Đất Nặn: off ra sân vận động tập.'],
      ['Băng Cát-xét = Trương Văn Tĩnh', 'Log Bi Thủy Tinh: “cô Trương Văn Tĩnh … người yêu âm nhạc nhất”. Log Băng Cát-xét: off đến phòng âm nhạc.'],
    ],
  },
  {
    id: 'confess', title: 'Nhật ký 1 — đối tượng tỏ tình (lớp giả)',
    rows: [
      ['Trương Văn Tĩnh ♥ Mã Tiểu Quân', 'Băng Cát-xét P4: chàng trai có giọng hát đặc biệt · Tranh Cát P2: giọng hay, cô gái mình thích yêu âm nhạc.'],
      ['Hà Hiểu Vân ♥ Trần Vệ', 'Bi Thủy Tinh P3–P4: cha mở tiệm nhỏ, chàng trai ở biệt thự phía nam · Đất Nặn P2, P4: ở biệt thự phía nam, cha cô gái mở quán chè khu tập thể.'],
      ['Diệp Bội Bội ♥ Trương Chấn', 'Dây Tết Hoa P4: chàng trai thích đá xay đậu xanh, gặp ở khu tập thể · Đá Xay Đậu Xanh P4: thích đá xay, cô gái mê dây tết hoa.'],
    ],
  },
  {
    id: 'wishes', title: 'Nguyện vọng A1–A6',
    rows: [
      ['Trương Văn Tĩnh', 'Đến thành phố lớn như Thượng Hải học nâng cao âm nhạc.'],
      ['Trương Chấn', 'Đưa mẹ (mẹ đơn thân) rời đi, đến Chiết Giang.'],
      ['Mã Tiểu Quân', 'Hoàn thành di nguyện của mẹ, thi đỗ Học viện Mỹ thuật Trung ương ở Bắc Kinh.'],
      ['Trần Vệ', 'Thoát khỏi sự quản thúc của gia đình, sống tự do — Tân Cương cũng khá tốt.'],
      ['Hà Hiểu Vân', 'Đến nơi kiếm được nhiều tiền, nghe nói Thâm Quyến phát triển lắm.'],
      ['Diệp Bội Bội', 'Mười năm không gặp cha, muốn đến Quảng Châu (nơi cha sống) đi học.'],
    ],
  },
  {
    id: 'photo', title: 'Ảnh phác họa AI & ghép hình',
    paras: [
      'Chụp cận chính diện người chơi số 6 (hoặc lấy selfie rõ mặt qua mạng xã hội từ trước — rất khuyến khích).',
      'Mở app “即梦AI (Jimeng AI)” → “想象 (Tưởng tượng)” → góc dưới trái “图片生成 (Tạo hình ảnh)” → “添加参考 (Thêm ảnh tham chiếu)” tải ảnh lên → nhập “将参考图变成素描风格图片” (biến ảnh tham chiếu thành ảnh phác họa chì) → tạo → chọn ảnh giống nhất. Phần mềm khác có hiệu quả tương tự cũng được.',
      'Xóa/cắt watermark, in ra giấy A4. Mặt sau viết 12 chữ “我如玫瑰，背光而长，向死而生” (Ta như hoa hồng, lớn lên trong bóng ngược sáng, hướng về cái chết mà sống).',
      'Xé thành 12 mảnh — mỗi người chơi 2 mảnh ở Giao diện 6. Làm trong lúc người chơi khôi phục loạn luân/phân tích vụ án (~5 phút).',
      'Nhớ: trong lúc vẽ hoa hồng, “vô tình” nói sai màu tranh của người chơi (Tưởng Văn rối loạn sắc giác).',
    ],
  },
  {
    id: 'clueB', title: 'Manh mối B1–B7 (cái chết của Tiếu Tiếu)',
    rows: [
      ['B1 Đơn xin du học Đan Mạch', 'Tiếu Tiếu sắp rời xa Tưởng Văn → động cơ của Tưởng Văn.'],
      ['B2 Lời khai bảo vệ', 'Tưởng Văn vào cổng trước 6:00, ra cổng sau 6:50 (đeo túi máy tính — có thể mang đầu). Hoan Hoan vào 6:20, ra 6:22 → bị loại trừ.'],
      ['B3 Môi trường', 'Công trường ồn đến 19:00 che mọi âm thanh. Mưa từ 18:15 → ai qua hành lang đều để lại dấu chân.'],
      ['B4 Thông tin thi thể', 'Mất đầu; máy nghe nhạc cầm tay → dùng để ngụy tạo thời gian tử vong.'],
      ['B5 Hiện trường', 'Phòng y tế, dao phẫu thuật; chặt đầu cần ≥10 phút; cửa sổ vỡ từ trong; tượng thạch cao vỡ; đồng hồ dừng 7:30 (có thể bị chỉnh).'],
      ['B6 Điều tra cảnh sát', 'Phòng nhỏ có giường nhỏ; Tiếu Tiếu bảo lưu 1 năm cấp hai → mang thai, sinh con.'],
      ['B7 Dấu chân (A4, chung)', 'Tiếu Tiếu vào từ cổng trước, đi thẳng qua phòng y tế đến văn phòng Tưởng Văn phía cổng sau.'],
    ],
    paras: [
      'Thủ pháp Tưởng Văn (lớp 1): ghi sẵn giọng Tiếu Tiếu bằng máy nghe nhạc; 6:00 ghi tiếng kính vỡ/đồ đổ ở phòng âm nhạc cách âm bằng máy ghi âm kiểu Nhật; kéo tượng thạch cao vào phòng y tế, đập cửa sổ/tượng, chỉnh đồng hồ 7:30 khi còn tiếng ồn công trường; giết Tiếu Tiếu ở văn phòng, quét sàn, chuyển xác (hắn vào trước mưa nên không dấu chân), khóa cửa, chặt đầu, thoát qua cửa sổ, ra cổng sau 6:50. 7:30 mọi người nghe tiếng → phá cửa 10 phút → tưởng hung thủ phá cửa sổ trốn.',
    ],
  },
  {
    id: 'family', title: 'Nhật ký 3 — bài văn C11–C15 & quan hệ huyết thống',
    rows: [
      ['C11 Trần Vệ', 'Cha quản lý tập đoàn đặt tên theo cha và cô ruột (Vạn Hâm = Trần Vạn Toàn + Trần Hâm Mẫn). Mẹ tên “Phương”; hai cháu trai “X Văn”, “X Vũ”.'],
      ['C12 Hà Hiểu Vân', 'Cha bị nghỉ việc, mở quán chè; bác (anh cha) mở bi-a đối diện. Mẹ và bác gái là chị em, mẹ là một trong 4 chị em gái.'],
      ['C13 Trương Chấn', 'Giọng hay giống cha, chưa từng gặp cha. Mang họ mẹ (Trương), mẹ làm nhà máy sợi. Dì út công tác ở THPT số 1. Hàng xóm dì Hồ, con trai dì là bạn nối khố.'],
      ['C14 Diệp Bội Bội', 'Cha Diệp Kiến Quốc: quản đốc, phát thanh viên, dẫn chương trình. Cậu Tôn Hải, mợ Mạnh Bình chết bệnh phổi; con gái Miêu Miêu được nhận nuôi. “Đừng quên hôm đó anh đã làm gì” → ly hôn.'],
      ['C15 Mã Tiểu Quân', 'Mẹ đã mất; từng trách cha không bảo vệ được mẹ.'],
      ['Chị em nhà họ Trương', 'Chị cả (mất sớm, không tên) · Chị hai Trương Nhạn Hà · Chị ba Trương Nhạn Tình · Em út Trương Văn Tĩnh.'],
      ['Trương Chấn & Diệp Bội Bội', 'Anh em cùng cha khác mẹ — Diệp Kiến Quốc (MC đám cưới 1984) ngoại tình với phù dâu Trương Nhạn Tình (C5, C6, C8).'],
      ['Trần Vệ & Hà Hiểu Vân', 'Chú – cháu gái: mẹ Trần Vệ là Hà Phương = cô ruột của Hà Văn & Hà Vũ; Hà Văn + Trương Nhạn Hà → Hà Hiểu Vân (C2, C5, C11, C12).'],
      ['Mã Tiểu Quân & Trương Văn Tĩnh', 'Mẹ kế – con riêng & cô giáo – học trò: Mã Đại Dũng + Trần Hâm Mẫn (mất trong sự kiện phản đối nghỉ việc) → Mã Tiểu Quân; phù dâu nhỏ nhất dan díu Mã Đại Dũng, dạy ở THPT số 1 (C3, C7). Bằng chứng giáo viên: nhật ký Băng Cát-xét không gọi Tiếu Tiếu là đàn chị, “tôi chăm sóc hai cô ấy”, không có bài văn.'],
    ],
  },
  {
    id: 'cases', title: 'Ba hung án — điểm mấu chốt & chống cãi',
    rows: [
      ['Vụ 1 (Trương Chấn / Trương Văn Tĩnh) — tranh cát / băng cát-xét', '① Điểm mù: trên đầu ông lão bày sạp, sau lưng hàng xóm tầng 6. ② Ô đen (biến mất) móc lan can trèo lên sân thượng. ③ Nhảy vào phòng ngủ hàng xóm đối diện (cảnh sát không lục). Tiếng ồn + băng ghi âm thu hút/che tiếng; máu bôi sàn che dấu vết.'],
      ['Chống cãi vụ 1', 'Ô thời đó tay cầm móc cong · Ô chỉ để mượn lực, chân + ma sát tường · Cảnh sát không lục nhà hàng xóm; rời đi sau là chuyện khác.'],
      ['Vụ 2 (Trần Vệ / Diệp Bội Bội) — đá xay / dây tết hoa', '① Nguồn độc duy nhất ra khỏi nhà là túi rác shipper mang đi. ② Uống đá xay 2 lần: lần 1 tự làm (đường-muối đựng ngược → mặn) có độc, lần 2 đặt quán không độc. ③ Cắt nước → dùng nước khoáng; chai độc ở vị trí đầu tiên ngăn cao nhất tủ lạnh 2,2m (cô cao 155cm).'],
      ['Chống cãi vụ 2', 'Hung thủ biết hôm đó cắt nước, hiểu chiều cao/thói quen · Uống sớm cũng không sao, mục tiêu chỉ là Diệp Bội Bội · Cô mắc chứng sạch sẽ nên nhờ shipper đổ rác.'],
      ['Vụ 3 (Mã Tiểu Quân / Hà Hiểu Vân) — bi thủy tinh / đất nặn', '① Ngủ ngày thức đêm + cửa sổ sát đất cực lớn + cây khô vàng → phải có rèm (đã biến mất). ② Lối thoát duy nhất: ống khói. ③ Rèm làm dây + xương đùi Hà Hiểu Vân làm thanh chữ T ở miệng ống khói. ④ Lau sạch tro bằng quần áo, ra ngoài rồi đốt lò sưởi → tro mới phủ đều.'],
      ['Chống cãi vụ 3', 'Ruột: phiền, mùi nặng · Tro đều vì đã lau trước · Rèm cực lớn + quần áo đủ tạo tro.'],
    ],
  },
  {
    id: 'loop', title: 'Đảo chiều thứ nhất — vòng tuần hoàn',
    rows: [
      ['Diệp Bội Bội thích', 'Trần Vệ (163cm, ngang tầm mắt, bóng dài như nhau; ngày nào cũng đưa người yêu về khu tập thể, mua đá xay).'],
      ['Trương Văn Tĩnh thích', 'Trương Chấn (giọng giống Diệp Kiến Quốc — mối tình non nớt năm xưa).'],
      ['Hà Hiểu Vân thích', 'Mã Tiểu Quân (188cm, biệt thự phía nam).'],
      ['Vòng tình yêu', 'Trương Chấn → Diệp Bội Bội → Trần Vệ → Hà Hiểu Vân → Mã Tiểu Quân → Trương Văn Tĩnh → Trương Chấn.'],
      ['Vòng giết', 'Diệp Bội Bội giết Trần Vệ · Trần Vệ giết Hà Hiểu Vân · Hà Hiểu Vân giết Mã Tiểu Quân · Mã Tiểu Quân giết Trương Văn Tĩnh · Trương Văn Tĩnh giết Trương Chấn · Trương Chấn giết Diệp Bội Bội.'],
      ['Thứ tự', '1/5: Trương Văn Tĩnh (gọi điện, đến lúc 12:30) giết Trương Chấn → Mã Tiểu Quân (xe máy nhanh hơn Santana kẹt mưa, nghe lén điện thoại) giết Trương Văn Tĩnh. Hà Hiểu Vân giết Mã Tiểu Quân → Trần Vệ (hàng xóm nhìn thấy) giết Hà Hiểu Vân. 3/5: Diệp Bội Bội giết Trần Vệ; Trương Chấn đã hạ độc nước khoáng từ trước (cùng khu, biết lịch cắt nước).'],
    ],
  },
  {
    id: 'owners', title: 'Chủ nhân thật của nhật ký & câu hỏi bảo mật',
    rows: [
      ['Đá Xay Đậu Xanh → LƯU SẤM', 'Phát hiện: ĐXĐX NK1 P5 “bạn nối khố” + Đất Nặn NK1 P5 “Trương Chấn và bạn nối khố Lưu Sấm”. Q1 cha: Lưu Cương (C3) · Q2 đối diện nhà: Trương Chấn (C13) · Q3 mẹ họ: Hồ · Q4: cha Lưu Cương chết trong sự kiện phản đối nghỉ việc.'],
      ['Dây Tết Hoa → TÔN MIÊU MIÊU', 'DTH NK1 P3 chị em thân + Bi Thủy Tinh NK1 P5 “Diệp Bội Bội và Tôn Miêu Miêu”. Q1 bố ruột: Tôn Hải · Q2 cha: Diệp Kiến Quốc (cha nuôi) · Q3 bệnh ghét: bụi phổi · Q4: cha mẹ ruột chết vì bụi phổi. Nhật ký có 2 cách gọi: bố mẹ (ruột) / cha mẹ (nuôi).'],
      ['Đất Nặn → LÝ BẰNG', 'Đất Nặn NK1 P5 “anh em tốt cùng dẫn đội bóng” + ĐXĐX NK1 P5 “Trần Vệ và Lý Bằng”. Q1 cha: Lý Minh Sơn (C2, C10) · Q2: cổ đông kiêm tổng giám đốc Tập đoàn Vạn Hâm · Q3: đội bóng rổ · Q4: đội trưởng (Lý Bằng thực ra là đội phó — chấp nhận cả hai). Lý Minh Sơn chủ đạo cải cách → “lạnh lùng tàn nhẫn”.'],
      ['Bi Thủy Tinh → HÀ LỊ LỊ', 'BTT NK1 P3 chị họ + Băng Cát-xét NK1 P5 “Hiểu Vân và Lị Lị”. Q1 cha: Hà Vũ · Q2 tiệm nhà: bi-a · Q3 tiệm đối diện: quán chè · Q4: bi thủy tinh — như bi-a thu nhỏ.'],
      ['Tranh Cát → HỒNG VŨ', 'Tranh Cát NK1 P3 “Hồng Vũ … Mã Tiểu Quân”. Q1 cha: Hồng Kim Khuê (C6) · Q2 mẹ đi: Singapore · Q3 lý do vẽ: tìm cách để không còn đau khổ (khác Mã Tiểu Quân — di nguyện của mẹ, A3) · Q4 bạn/đối thủ: Mã Tiểu Quân.'],
      ['Băng Cát-xét → PHÀN DIỄM', 'Băng Cát-xét NK1 P3 “Phàn Diễm, cậu cũng ở đây à?”. Q1 mối tình đầu: Diệp Kiến Quốc · Q2 lý do: giọng nói · Q3 cha: giám đốc nhà máy Phàn (Phàn Lập Trung, C3, C6) · Q4 yêu người thứ hai vì: giống giọng nói trong ký ức.'],
      ['Người yêu thật', 'Lưu Sấm ♥ Diệp Bội Bội · Tôn Miêu Miêu ♥ Trần Vệ · Lý Bằng ♥ Hà Hiểu Vân · Hà Lị Lị ♥ Mã Tiểu Quân · Hồng Vũ ♥ Trương Văn Tĩnh · Phàn Diễm ♥ Trương Chấn.'],
    ],
  },
  {
    id: 'realkillers', title: 'Đảo chiều vụ án — hung thủ thật',
    rows: [
      ['Tư thế chết ↔ biệt danh', 'Trương Chấn: băng cát-xét · Diệp Bội Bội: đá xay đậu xanh · Trần Vệ: dây tết hoa · Hà Hiểu Vân: đất nặn · Mã Tiểu Quân: bi thủy tinh · Trương Văn Tĩnh: tranh cát.'],
      ['Vụ 1', 'Lưu Sấm (hàng xóm đối diện, làm chứng giả) + Phàn Diễm (người yêu Trương Chấn, mời bạn thân Trương Văn Tĩnh đến). Ông lão không nói dối: người phụ nữ cầm ô là Trương Văn Tĩnh.'],
      ['Vụ 2 (biệt thự)', 'Hồng Vũ (cùng học vẽ, nắm giờ sinh hoạt Mã Tiểu Quân, kéo Hà Lị Lị lên ống khói bằng rèm, đốt lò sưởi) + Hà Lị Lị (mời chị họ Hà Hiểu Vân đến, giết cả hai).'],
      ['Vụ 3 (đá xay)', 'Lý Bằng (nhân viên bán hàng chợ nông sản Vạn Hâm, đưa thuốc trừ sâu cho Lưu Sấm) + Tôn Miêu Miêu (sống trong nhà Diệp Bội Bội: tráo hũ đường/muối, mời Trần Vệ, gọi đá xay, nhờ shipper đổ rác).'],
      ['Mô thức', 'Ba bạn nam lập kế hoạch, ba bạn nữ ra tay — ba bên cùng mưu sát.'],
    ],
  },
  {
    id: 'xiaodeath', title: 'Sự thật cái chết của Tiếu Tiếu',
    rows: [
      ['Hung thủ', 'Yến Hoan Hoan — dùng lưỡi dao giày trượt băng, chỉ cần 2 phút để giết; 6 người còn lại làm hết phần việc ~40 phút song song (<10 phút).'],
      ['Bi Thủy Tinh', 'Quét dọn văn phòng Tưởng Văn, lấy mẩu giấy hẹn (NK2 P8).'],
      ['Đất Nặn', 'Bày danh sách mua sắm + chứng cứ Tiếu Tiếu trầm cảm ở phòng họp.'],
      ['Băng Cát-xét', 'Phòng âm nhạc: đóng cửa cách âm, ghi tiếng gương vỡ, đàn piano đổ.'],
      ['Đá Xay Đậu Xanh', 'Phòng máy tính: cắm đĩa — trò chơi Tưởng Văn làm + ảnh “Hoa Hồng” giống Tiếu Tiếu → tạo động cơ cho Tưởng Văn.'],
      ['Tranh Cát', 'Phòng mỹ thuật: khiêng tượng thạch cao sang phòng y tế.'],
      ['Dây Tết Hoa', 'Chặt cửa phòng y tế 10 phút để Hoan Hoan bên trong chặt đầu; giả ngất, lên xe cứu thương cùng cặp sách chứa đầu (NK2 P8–P9).'],
      ['Cú chốt cuối (GD6)', 'Tiếu Tiếu biết mình bị từ chối (D1 — trầm cảm), tự ĐI LÙI từ văn phòng Tưởng Văn đến chỗ Hoan Hoan: “lớn lên trong bóng ngược sáng, hướng về cái chết mà sống” → đảo điểm đầu/cuối dấu chân, bù 3 phút vận chuyển xác, đổ tội cho Tưởng Văn.'],
      ['Đầu ở đâu (GD4)', 'Vườn hoa hồng nhà Hoan Hoan (thư trang 2 & 7 — 99 đóa hồng).'],
      ['Hung khí (GD5)', 'Lưỡi dao giày trượt băng (quà sinh nhật Tiếu Tiếu tặng).'],
    ],
  },
  {
    id: 'invites', title: 'Thư mời → thân phận thật (phần in đậm)',
    rows: [
      ['Số 1', '“Bạn gái yêu bạn ba năm vì giấc mơ âm nhạc…” → người yêu Trương Văn Tĩnh → HỒNG VŨ.'],
      ['Số 2', '“…thi vào trường đại học ở thành phố nơi cha cô ấy làm việc” → Diệp Bội Bội (Quảng Châu) → người yêu LƯU SẤM.'],
      ['Số 3', '“Bạn gái muốn để cha sống tốt hơn, đến Thâm Quyến lập nghiệp” → Hà Hiểu Vân → LÝ BẰNG.'],
      ['Số 4', '“Bạn trai yêu tự do, cho rằng cha mẹ giam cầm mình” → Trần Vệ → TÔN MIÊU MIÊU.'],
      ['Số 5', '“Bạn trai vì ước mơ mỹ thuật…” → Mã Tiểu Quân → HÀ LỊ LỊ.'],
      ['Số 6', 'Đến từ trại trẻ mồ côi → con gái Tiếu Tiếu, “Hoa Hồng” thế hệ thứ ba (Phàn Diễm thật đã mất vì bệnh).'],
    ],
  },
  {
    id: 'rose', title: 'Sơ đồ hoa hồng trên bảng (7 bước)',
    paras: [
      'Bước 1: Tên lớp 1 (Trương Chấn, Trương Văn Tĩnh, Diệp Bội Bội, Mã Tiểu Quân, Trần Vệ, Hà Hiểu Vân) xếp vòng tròn, đối xứng ngay ngắn.',
      'Bước 2: Vẽ cánh hoa — các mũi tên cong nối tên theo vòng tình yêu.',
      'Bước 3: Viết tên lớp 2 bằng BÚT ĐỎ, đối xứng ngay ngắn (Lưu Sấm, Tôn Miêu Miêu, Lý Bằng, Hà Lị Lị, Hồng Vũ, Phàn Diễm).',
      'Bước 4–5: Vẽ cành + lá + gai.',
      'Bước 6: Vẽ lớp trong, nhụy + cánh hoa lớp ngoài cùng.',
      'Bước 7: Tô thêm màu lên cánh hoa — ít nhất 2 màu đen & đỏ, nhìn rõ là một bông hồng.',
      'Lời thoại: “12 con người, nở rộ thành 6 đóa hồng kiều diễm, điên cuồng sinh trưởng, hòa quyện vào nhau, trở thành một phần của nhau.”',
    ],
  },
  {
    id: 'timeline', title: 'Thời gian tham khảo',
    rows: [
      ['Lượt 1 (~130–140 phút)', 'Mở màn 5′ · Phòng chat 2′+7′ · NK1 3′+10′ · NK2 2′+20′ · NK3 2′+20′ · NK4 1′ + 3 vụ án 30–40′ · Đảo chiều 1: 25–30′'],
      ['Lượt 2', 'Thư Hoan Hoan 10′ + chuyển tiếp 10′'],
      ['Lượt 3 (~80–90 phút)', 'GD1 5′ · GD2 20–25′ · Vụ án đảo chiều 15–20′ · GD3 ~10′ · GD4 3′ · GD5 2′ · GD6 2′ · Thân phận DM 5′ · Thân phận người chơi 5′ · Sự thật cái chết 10′ · Hồi kết 10′ · Kết thúc 5′'],
      ['Tổng', 'Khoảng 240–260 phút'],
    ],
  },
  {
    id: 'endings', title: 'Kết cục',
    rows: [
      ['Đèn tín hiệu CHƯA tắt hết', 'Âm thanh 18 → bấm “Tiếp tục trò chơi” → Kết cục 1: Đóa hồng mới.'],
      ['Đèn tín hiệu tắt HẾT', 'Âm thanh 19 → bấm “Tắt trò chơi” → Kết cục 2: Trở về hiện thực.'],
      ['Sau đó', 'Nhạc 20 permafrost → lời kết Tưởng Văn → thoát vai.'],
    ],
  },
];
