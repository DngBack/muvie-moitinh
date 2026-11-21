/**
 * Kịch bản dẫn từng bước — chuyển từ Sổ tay người dẫn trò.
 * Ký hiệu (giống sổ tay):
 *   action  → nền vàng  : hành động (phát kịch bản/thẻ, bật/tắt đèn…)
 *   warn    → nền đỏ    : lưu ý quan trọng
 *   line    → gạch chân : lời thoại của DM / NPC
 *   music   → chữ đỏ    : chuyển nhạc nền / âm thanh (có nút phát)
 *   open    → nút mở giai đoạn trên app người chơi
 *   qa      → câu hỏi dẫn dắt + kết luận + nguồn manh mối
 *   note    → ghi chú thường
 */
import type { StageKey } from '@/lib/types';

export type Block =
  | { t: 'action'; text: string }
  | { t: 'warn'; text: string }
  | { t: 'line'; text: string; who?: string }
  | { t: 'music'; cue: string; text?: string }
  | { t: 'open'; stage: StageKey; text?: string }
  | { t: 'qa'; q: string; a: string; src?: string }
  | { t: 'note'; text: string }
  | { t: 'list'; items: string[] };

export interface Step {
  id: string;
  part: string;
  title: string;
  time?: string;
  lookup?: string;
  blocks: Block[];
}

export const DM_STEPS: Step[] = [
  {
    id: 'prep', part: 'Chuẩn bị', title: 'Chuẩn bị trước khi mở kịch bản', time: '5 phút',
    blocks: [
      { t: 'list', items: [
        'Trang phục: DM cuối game hóa thân Tưởng Văn (giáo viên) — có thể đeo kính gọng kim loại. Có thể chuẩn bị đồng phục trung học cho người chơi.',
        'Ánh sáng: phòng phải tắt được toàn bộ nguồn sáng, tạo không gian tối hoàn toàn.',
        'Đối chiếu vật phẩm: 6 thư mời, 6 kịch bản, 6 tập hồ sơ vụ án, 6 “Thư của Hoan Hoan”, thẻ A1–A6, B1–B7 (B7 khổ A4), C1–C15 (C11–C15 khổ A4), D1.',
        'Cửa hàng chuẩn bị: bảng trắng lớn (hoặc 2 bảng), giấy A4, bút màu nước, máy in (hoặc tiệm in gần), một cành hoa hồng, nến, loa.',
        'Thiết bị phát video: máy chiếu > TV > máy tính bảng > điện thoại.',
        'Mã QR: dán QR nhân vật vào trang đầu mỗi kịch bản và QR “Thư của Hoan Hoan” (trang DM → In mã QR).',
        'Tạo lượt chơi mới trên app để có mã khóa lời mời; có thể viết sẵn mã lên bảng trắng.',
      ] },
      { t: 'action', text: 'Đặt kịch bản theo sơ đồ chỗ ngồi, mỗi cuốn kèm một đèn nến đang TẮT. Phòng tối hoàn toàn, giữa bàn đặt một đèn nến làm nguồn sáng.' },
      { t: 'note', text: 'Chuẩn bị tâm thế — hãy thỏa sức thể hiện sức hút của bạn!' },
    ],
  },
  {
    id: 'cast', part: 'I. Vào phòng', title: 'Chọn vai và phát thư mời', time: '5 phút', lookup: 'identity',
    blocks: [
      { t: 'action', text: 'Tập hợp người chơi bên ngoài cửa để chọn vai.' },
      { t: 'warn', text: 'Thận trọng khi chọn người nhận thư mời số 6 (Băng Cát-xét) — KHÔNG đổi giới tính vai. Đây là con gái của Tưởng Tiếu Tiếu, nhân vật của cú đảo chiều cuối cùng. Nên chọn bạn nữ có ngoại hình nổi bật hơn một chút.' },
      { t: 'line', text: 'Xin chào mọi người, chào mừng mọi người đến với quán kịch bản sát XXX. Tôi là DM XXX của buổi chơi hôm nay. Kịch bản mà chúng ta sẽ trải nghiệm có tên là 《Mối Tình Đẫm Máu》, là một kịch bản tình cảm dành cho 3 nam và 3 nữ. Mọi người biết rồi chứ? (đùa vui)' },
      { t: 'line', text: 'Tất nhiên là tôi đang đùa. Đây là một kịch bản trải nghiệm tập trung vào việc khôi phục sự thật và câu chuyện. Những tình tiết hoặc cách bố trí đạo cụ đều nhằm phục vụ câu chuyện tốt hơn. Dù là vụ án, nội dung hơi rùng rợn hay tình cảm, tất cả đều nhằm thúc đẩy diễn biến câu chuyện. Mong mọi người đừng quá để bụng.' },
      { t: 'line', text: 'Câu chuyện diễn ra vào khoảng thời điểm bước sang thiên niên kỷ mới, có ba nhân vật nam. Châm ngôn của nhân vật nam thứ nhất là: ‘Giữa tả thực và trừu tượng, tôi chọn làm chuyện sắc dục.’' },
      { t: 'line', text: 'Châm ngôn của nhân vật nam thứ hai là: ‘Giải khát hơn trà xanh, mát mẻ cả mùa hè, xua nóng hạ hỏa.’' },
      { t: 'line', text: 'Châm ngôn của nhân vật nam thứ ba là: ‘Muốn nắn bóp cũng được, nhưng phải cam tâm tình nguyện; gặp người thích thì mềm nhũn, gặp người không thích thì cứng đơ.’ — Mời ba bạn nam lựa chọn thân phận của mình.' },
      { t: 'action', text: 'Nam 1 = 【Tranh Cát】 thư mời số 1 · Nam 2 = 【Đá Xay Đậu Xanh】 thư mời số 2 · Nam 3 = 【Đất Nặn】 thư mời số 3.' },
      { t: 'line', text: 'Tiếp theo là ba nhân vật nữ. Châm ngôn của nhân vật nữ thứ nhất là: ‘Trói buộc và quất đánh đều không bỏ lỡ, một sợi dây hai công dụng.’' },
      { t: 'line', text: 'Châm ngôn của nhân vật nữ thứ hai là: ‘Bi thủy tinh rất cứng, nhưng còn cứng hơn nó là cái đầu chỉ biết yêu đương của mình.’' },
      { t: 'line', text: 'Châm ngôn của nhân vật nữ thứ ba là: ‘Cảm âm tuyệt đối, nghe tiếng nhận người, cao thủ buôn điện thoại, đúng phong cách mẹ kế trẻ, cũng có thể là phong cách dì trẻ.’ — Mời ba bạn nữ lựa chọn thân phận của mình.' },
      { t: 'action', text: 'Nữ 1 = 【Dây Tết Hoa】 thư mời số 4 · Nữ 2 = 【Bi Thủy Tinh】 thư mời số 5 · Nữ 3 = 【Băng Cát-xét】 thư mời số 6.' },
      { t: 'note', text: 'Khi phát thư mời số 6, tương tác thêm một hai câu để cài chi tiết cho cú đảo chiều cuối (DM là Tưởng Văn, cô ấy là “Hoa Hồng”).' },
      { t: 'line', text: 'Nói thật với bạn, tôi đã vất vả tìm bạn biết bao. Hy vọng phần chơi tiếp theo sẽ thuận lợi; tôi sẽ luôn giúp đỡ bạn.' },
      { t: 'action', text: 'Người chơi đọc thư mời bên ngoài cửa, không xem của nhau. Đọc xong dẫn vào phòng tối, chỉ có một đèn nến trên bàn.' },
    ],
  },
  {
    id: 'opening', part: 'I. Vào phòng', title: 'Mở màn và đăng nhập app', time: '5 phút',
    blocks: [
      { t: 'music', cue: '01', text: 'Người chơi làm theo hướng dẫn để vào chỗ và bật đèn nến tín hiệu' },
      { t: 'music', cue: '02', text: 'Sau khi âm thanh kết thúc' },
      { t: 'action', text: 'Bật đèn (bất kể ánh sáng thế nào, KHÔNG được tắt đèn nến tín hiệu của người chơi).' },
      { t: 'line', text: 'Xin chào mọi người, trò chơi 《Mối Tình Thiên Niên Kỷ 2》 chính thức bắt đầu. Tôi là NPC trong lượt chơi này của các bạn. Để cốt truyện diễn tiến thuận lợi, tôi sẽ đảm nhận những vai khác nhau trong quá trình chơi.' },
      { t: 'line', text: 'Để xác nhận sau khi kết nối với giao diện não–máy, các bạn có đang ở trạng thái mất trí nhớ hay không, tôi sẽ đặt cho mọi người một câu hỏi. Xin hỏi, nếu người yêu của các bạn, người mà các bạn yêu rất sâu đậm, vì đủ loại nguyên nhân mà nói muốn rời bỏ các bạn, giả sử các bạn nhất quyết muốn giữ người ấy lại, các bạn sẽ chọn cách nào để giữ họ?' },
      { t: 'line', text: '(Sau khi mọi người trả lời) Hệ thống phát hiện câu trả lời của các bạn không phù hợp với lẽ thường, chứng tỏ các bạn đã ở trạng thái mất trí nhớ. Vậy trò chơi chính thức bắt đầu.' },
      { t: 'line', text: 'Câu chuyện xảy ra vào năm thiên niên kỷ, tức năm 2000 Công nguyên. Đó là thời đại chuyển giao thế kỷ, một thời đại phát triển hoang dã, cũng là một thời đại gắn với ký ức và giấc mơ. Thế nhưng, những hồi ức của chúng ta về năm thiên niên kỷ nay đã trở thành một cuộc viếng mộ tập thể. Chúng ta có thể quay lại nơi ấy, nhưng ở đó đã chẳng còn ai. Hôm nay, tôi sẽ đưa mọi người một lần nữa trở về giấc mộng ấy. Vào thời gian đó, OICQ đổi tên thành QQ. Hãy bật âm thanh điện thoại, quét mã QR ở trang đầu tiên của kịch bản để vào lượt chơi thứ nhất — phòng trò chuyện QQ.' },
      { t: 'action', text: 'Hướng dẫn quét QR trang đầu kịch bản → màn “Nhập mã khóa lời mời”. Thông báo mã khóa (hiển thị trên đầu trang Điều khiển).' },
      { t: 'warn', text: 'Nhắc người chơi bật âm thanh điện thoại. Kéo phòng chat đọc từ trên xuống dưới. KHÔNG được lật đọc kịch bản!' },
      { t: 'open', stage: 'chat', text: 'Phòng chat tự mở khi đủ 6 người vào. Nếu cần, bấm mở thủ công.' },
    ],
  },
  {
    id: 'chat', part: 'II. Phòng chat QQ', title: 'Đọc phòng chat — tìm tên tương ứng', time: '10 phút', lookup: 'names',
    blocks: [
      { t: 'music', cue: '03' },
      { t: 'line', text: 'Phòng chat này hiện chỉ hiển thị biệt danh của mọi người, còn muốn đăng nhập vào không gian nhật ký của họ thì cần nhập mật khẩu, gợi ý mật khẩu là ‘họ tên’. Chi bằng mọi người chia sẻ nội dung phòng chat với nhau, xem có thể tìm ra tên tương ứng của nhau hay không. Lưu ý, đừng thử nhập tên bừa bãi, nếu không trò chơi có thể sẽ bị chấm dứt.' },
      { t: 'warn', text: 'Nếu có người thấy tên là bảo cả nhóm nhập thử: ngắt lời, yêu cầu tìm ra LÝ DO vì sao mình là cái tên này. (Tab Lượt chơi hiển thị số lần nhập sai của từng người.)' },
      { t: 'qa', q: 'Đá Xay Đậu Xanh / Bi Thủy Tinh là ai?', a: 'Đá Xay Đậu Xanh = Trương Chấn; Bi Thủy Tinh = Hà Hiểu Vân.', src: 'Log Dây Tết Hoa: ảnh đại diện tất đen, “màu cô ấy thích lúc nào cũng ngược với tớ”. Log Bi Thủy Tinh: thích mây trắng, ghét Trương Chấn mặc đồ đen.' },
      { t: 'qa', q: 'Tranh Cát là ai?', a: 'Mã Tiểu Quân.', src: 'Log Đá Xay Đậu Xanh: Mã Tiểu Quân vẽ ở phòng mỹ thuật. Log Đất Nặn: “Tranh Cát đi Cung Thiếu nhi luyện vẽ”.' },
      { t: 'qa', q: 'Dây Tết Hoa là ai?', a: 'Diệp Bội Bội.', src: 'Log Băng Cát-xét: cô bé bán dây tết hoa “không ăn thì chẳng cao lên được”. Log Đất Nặn: Diệp Bội Bội rất thấp.' },
      { t: 'qa', q: 'Đất Nặn là ai?', a: 'Trần Vệ.', src: 'Log Tranh Cát: Trần Vệ dẫn đội bóng tập. Log Đá Xay Đậu Xanh: ban ngày tập luyện. Log Đất Nặn: off để ra sân vận động tập.' },
      { t: 'qa', q: 'Băng Cát-xét là ai?', a: 'Trương Văn Tĩnh.', src: 'Log Bi Thủy Tinh: “cô Trương Văn Tĩnh … người yêu âm nhạc nhất”. Log Băng Cát-xét: off đến phòng âm nhạc.' },
      { t: 'note', text: 'Nhập đúng tên → app hiển thị đang tải nhật ký. Sau đó rất lâu không dùng app cho tới lượt chơi thứ ba (nhật ký nằm trong cuốn kịch bản).' },
      { t: 'line', text: 'Chúc mừng mọi người đều đã tìm đúng tên của mình. Để mọi người tiện đọc nội dung nhật ký tiếp theo, tôi đã chép nội dung nhật ký của từng người vào cuốn kịch bản trước mặt các bạn, mời mọi người bắt đầu đọc thiên nhật ký thứ nhất.' },
    ],
  },
  {
    id: 'diary1', part: 'III. Nhật ký 1', title: 'Chia sẻ & tìm đối tượng tỏ tình', time: '3 + 10 phút', lookup: 'confess',
    blocks: [
      { t: 'music', cue: '04' },
      { t: 'line', who: 'Tiếu Tiếu (tươi sáng, hay cười)', text: 'Chào mọi người, các em có biết chị là ai không? Đương nhiên là đàn chị xinh đẹp Tưởng Tiếu Tiếu của các em rồi. Giữa chúng ta cách nhau một khối lớp, nên chị vẫn chưa rõ lắm câu chuyện của các em, nhân lúc xe buýt còn chưa đến nơi, mọi người thử chia sẻ cuộc đời của mình xem nào～' },
      { t: 'action', text: 'Người chơi lần lượt chia sẻ ngắn gọn câu chuyện của mình.' },
      { t: 'line', who: 'Tiếu Tiếu', text: 'Nghe nói hôm nay các em đều đến đây để tỏ tình, các em có thể cho chị biết, các em định tỏ tình với ai không?' },
      { t: 'qa', q: 'Cặp đôi (giả) lần 1', a: 'Trương Văn Tĩnh ♥ Mã Tiểu Quân · Hà Hiểu Vân ♥ Trần Vệ · Diệp Bội Bội ♥ Trương Chấn', src: 'Băng Cát-xét NK1 P4 (giọng hát đặc biệt) + Tranh Cát P2 (giọng hay, cô gái yêu âm nhạc); Bi Thủy Tinh P3–P4 (cha mở tiệm, chàng trai ở biệt thự phía nam) + Đất Nặn P2, P4; Dây Tết Hoa P4 + Đá Xay Đậu Xanh P4.' },
      { t: 'note', text: 'Mục đích: khôi phục nhanh rồi chuyển sang bầu không khí tỏ tình vui vẻ — phía sau sẽ có hai lần đảo chiều.' },
      { t: 'warn', text: 'Nếu người chơi nhận ra người mình thích trong thư mời khác với hiện tại: “Thư mời nào? Sao tôi không có thư mời nhỉ?” (đã kết nối não–máy, mọi người đều mất trí nhớ).' },
    ],
  },
  {
    id: 'rose', part: 'III. Nhật ký 1', title: 'Vẽ hoa hồng tỏ tình', time: '~10 phút', lookup: 'photo',
    blocks: [
      { t: 'line', who: 'Tiếu Tiếu', text: 'Các em đều chẳng thật thà gì cả, tuổi còn nhỏ đã biết yêu sớm rồi, ha ha, nhưng không sao, chị rất hiểu, vì chị cũng có người mình thích. Nhưng tỏ tình thì không thể đi tay không được, ít nhất cũng phải có một bó hoa hồng chứ, các em có mang hoa hồng theo không?' },
      { t: 'line', who: 'Tiếu Tiếu', text: 'Không sao, nếu mọi người đều không mang thì chúng ta hãy vẽ đóa hoa hồng trong lòng mình ra! Ngoài việc vẽ hoa hồng, còn phải lồng ghép thật hoàn hảo những thứ mình thích vào đó thì mới thể hiện được tấm lòng của mình! Vẽ xong thì trình bày lý do sáng tác của mình với đối phương, sau đó tiến hành tỏ tình.' },
      { t: 'action', text: 'Phát 6 tờ giấy A4 trắng và bút màu nước. Vẽ xong lần lượt trình bày và tỏ tình theo lời thoại gợi ý trong kịch bản.' },
      { t: 'warn', text: 'TRỌNG ĐIỂM 1 — Chụp ảnh: chụp cho từng người, QUAN TRỌNG NHẤT là người thư mời số 6 — chụp cận chính diện khuôn mặt rõ nét (dùng AI tạo ảnh phác họa). Cách 2 (rất khuyến khích): kết bạn WeChat/Zalo trước, dùng ảnh selfie rõ mặt.' },
      { t: 'line', text: 'Nào, để chị chụp cho các em một tấm ảnh, ghi lại khoảnh khắc tỏ tình tuyệt đẹp này của các em.' },
      { t: 'warn', text: 'TRỌNG ĐIỂM 2 — Trong lúc vẽ, nhận xét tranh và “vô tình” nói SAI màu sắc trong tranh của người chơi (Tưởng Văn mắc chứng rối loạn sắc giác — dùng ở cú đảo chiều sau).' },
      { t: 'note', text: 'Làm ảnh phác họa + in + viết 12 chữ phía sau + xé 12 mảnh: rời phòng làm trong lúc người chơi khôi phục mối tình loạn luân hoặc phân tích vụ án (~5 phút). Xem Tra cứu → “Ảnh phác họa & ghép hình”. Hạn chế chụp lén.' },
    ],
  },
  {
    id: 'wish', part: 'III. Nhật ký 1', title: 'Nguyện vọng của mỗi người (A1–A6)', lookup: 'wishes',
    blocks: [
      { t: 'line', who: 'Tiếu Tiếu', text: 'Lời tỏ tình của các em sến thật đấy, đúng là đáng ghen tị. Vậy chị chỉ còn cách chia sẻ một tin vui với mọi người thôi, chị đã nộp hồ sơ vào một trường đại học ở Đan Mạch, sau khi thi đại học tốt nghiệp xong, chị sẽ sang Đan Mạch du học. Là quê hương của truyện cổ tích Andersen, chị tin rằng nơi đó đối với chị sẽ là một hành trình đầy kỳ ngộ và lãng mạn, hơn nữa, chị đến đó cũng là muốn dành cho một người một sự bất ngờ. Còn nữa, trước khi lên xe chị đã bảo các em chuẩn bị nguyện vọng của mỗi người sau kỳ thi đại học, để chị xem điều này là của ai nào?' },
      { t: 'action', text: 'Cầm 6 thẻ nguyện vọng A1–A6, chỉ ĐỌC nội dung. Người chơi nói đúng nguyện vọng của mình mới phát.' },
      { t: 'line', who: 'Tiếu Tiếu', text: 'Được rồi, chúc mọi người trong kỳ thi đại học năm sau đều thực hiện được nguyện vọng của mình. Thấy mọi người đều có người mình thích, chị cũng rất vui, có lẽ cả đời này chỉ có quãng thời gian tươi đẹp này mới trở thành ký ức không thể xóa nhòa trong tương lai của chúng ta. Ước gì có thể mãi mãi dừng lại ở khoảnh khắc này.' },
      { t: 'line', who: 'Tiếu Tiếu', text: 'Thôi, không buồn nữa, chuyến đi hôm nay kết thúc rồi, đến lúc về nhà thôi, các em khóa dưới, ngày mai gặp lại nhé. Mọi người có thể tiếp tục lật đọc thiên nhật ký tiếp theo.' },
    ],
  },
  {
    id: 'diary2', part: 'IV. Nhật ký 2', title: 'Cái chết của Tiếu Tiếu', time: '2 + 20 phút', lookup: 'clueB',
    blocks: [
      { t: 'music', cue: '05' },
      { t: 'action', text: 'Khi người chơi BẮT ĐẦU đọc thì đột ngột TẮT ĐÈN (đèn nến tín hiệu làm nguồn sáng).' },
      { t: 'line', text: 'Các vị, đàn chị và cũng là bạn của các bạn — Tưởng Tiếu Tiếu đã bị sát hại một cách kỳ lạ vào tối nay, mà các bạn lại là những nhân chứng đầu tiên, vì vậy, nhiệm vụ của giai đoạn này là khôi phục chân tướng cái chết của Tiếu Tiếu, tìm ra hung thủ đã giết Tiếu Tiếu, phá giải thủ pháp gây án và động cơ giết người. Nhật ký của các bạn đã ghi lại góc nhìn của từng người trong ngày hôm đó, ngoài ra, ở đây còn có một số manh mối của năm đó để mọi người tham khảo.' },
      { t: 'action', text: 'Phát B1–B7: mỗi người ngẫu nhiên 1 thẻ, B7 (bản đồ) là manh mối chung. Chia sẻ thẻ xong → chia sẻ nhật ký.' },
      { t: 'qa', q: '1) Ai là người khả nghi?', a: 'Tưởng Văn', src: 'ĐXĐX NK2 P8 (cha nuôi, coi Tiếu Tiếu là vật thay thế Hoa Hồng); Bi Thủy Tinh NK2 P8 (mẩu giấy hẹn gặp).' },
      { t: 'qa', q: '2) Động cơ? Vì sao chặt đầu?', a: 'Tiếu Tiếu định sang Đan Mạch; dung mạo giống Hoa Hồng → dục vọng biến thái, giữ lại khuôn mặt.', src: 'B1 + ĐXĐX NK2 P8.' },
      { t: 'qa', q: '3) “Các người” trên mẩu giấy là ai?', a: 'Tiếu Tiếu và đứa con của Tiếu Tiếu với Tưởng Văn.', src: 'Bi Thủy Tinh NK2 P8 + B6 (phòng nhỏ, giường nhỏ, bảo lưu 1 năm).' },
      { t: 'qa', q: '4–5) Tưởng Văn rời trường 6:50, sao giết người lúc 7:30?', a: 'Thủ pháp trì hoãn thời gian: ghi âm giọng Tiếu Tiếu bằng máy nghe nhạc + ghi tiếng kính vỡ/đồ đổ ở phòng âm nhạc (cách âm) bằng máy ghi âm kiểu Nhật; đập cửa sổ, tượng thạch cao, chỉnh đồng hồ về 7:30 khi công trường còn ồn (trước 19h).', src: 'B2, B3, B4, B5; Đất Nặn, Dây Tết Hoa, Băng Cát-xét NK2 P8; B7 + B3 (dấu chân ướt sau 6:15).' },
      { t: 'qa', q: 'Chống cãi: có đồng phạm? Hoan Hoan?', a: 'Hiện không có bằng chứng; Hoan Hoan không có động cơ, không đủ thời gian (chỉ ở trong 2 phút), chính cô dẫn mọi người đến.' },
      { t: 'line', text: 'Xem ra, Tưởng Văn — với tư cách là hung thủ — có đủ động cơ giết người và thời gian gây án. Về cơ bản có thể xác định hắn chính là hung thủ giết Tiếu Tiếu. Không mấy ngày sau khi Tiếu Tiếu chết, cảnh sát dựa vào tình hình hiện trường cũng đã đưa ra kết luận tương ứng, mời mọi người lật đọc nội dung Nhật ký 3.' },
      { t: 'action', text: 'BẬT ĐÈN. Hướng dẫn đọc Nhật ký 3.' },
    ],
  },
  {
    id: 'diary3', part: 'V. Nhật ký 3', title: 'Phát thanh & mối tình loạn luân', time: '2 + 20 phút', lookup: 'family',
    blocks: [
      { t: 'music', cue: '06' },
      { t: 'music', cue: '07', text: 'Sau khi người chơi đọc xong Nhật ký 3 — xong thì chuyển lại 06' },
      { t: 'line', text: 'Ngay lúc các bạn sắp thi đại học, sắp tốt nghiệp, tiếng phát thanh này đã vang khắp cả ngôi trường, các bạn có biết lý do mình bị đuổi học không? … Về lý mà nói, nếu chỉ đơn thuần là yêu sớm, cùng lắm là bị ghi lỗi hoặc mời phụ huynh, tuyệt đối sẽ không bị đuổi học. Theo những gì được biết, việc các bạn bị đuổi học năm đó có liên quan trực tiếp đến thế hệ cha mẹ cũng như thân thế của các bạn. Đây là mấy bài văn viết trên lớp được tìm thấy trong phòng lưu trữ hồ sơ, cùng một số manh mối khác của năm đó. À phải rồi, không biết vì sao lại không tìm thấy bài văn của Trương Văn Tĩnh, Trương Văn Tĩnh, bạn có thể xem các manh mối khác trước.' },
      { t: 'action', text: 'Phát C11–C15 (bài văn) cho người chơi tương ứng; phát C1–C10 cho người chơi Trương Văn Tĩnh.' },
      { t: 'note', text: 'Khuyến khích người chơi tự lên viết bảng (bên trái). DM viết bên phải về sau. Nếu người chơi nhắc “thân phận bên trong” (Lưu Sấm, Phàn Diễm…): “Những người này không quan trọng lắm, hãy tìm những người có quan hệ huyết thống với mình trước đã.”' },
      { t: 'qa', q: 'Trương Chấn & Diệp Bội Bội?', a: 'Anh em cùng cha khác mẹ (cha: Diệp Kiến Quốc; mẹ Trương Chấn: Trương Nhạn Tình).' },
      { t: 'qa', q: 'Hà Hiểu Vân & Trần Vệ?', a: 'Chú – cháu gái (mẹ Trần Vệ là Hà Phương, cô ruột của Hà Văn — cha Hà Hiểu Vân).' },
      { t: 'qa', q: 'Mã Tiểu Quân & Trương Văn Tĩnh?', a: 'Mẹ kế – con riêng, đồng thời là cô giáo âm nhạc – học trò.' },
      { t: 'line', text: 'Hóa ra, trong chuyện tình cảm của các bạn, lại có tới 3 cặp tình yêu loạn luân, thảo nào trong phát thanh lại nhắc đến việc đi ngược thuần phong mỹ tục. Theo tôi được biết, các bạn năm đó bị đuổi học, chính là vì có người đã cầm chứng cứ đi tố cáo với nhà trường. Các bạn có biết kẻ đã tố cáo các bạn là ai không? … Nhà trường để bảo vệ an toàn cho người tố cáo, vẫn luôn không tiết lộ. Nhưng dù thế nào đi nữa, khi tiếng phát thanh này bị công khai, mọi quỹ đạo cuộc đời của các bạn đều bắt đầu thay đổi. Các bạn đã viết thiên cuối cùng trong nhật ký, có thể tiếp tục đọc nội dung cuối cùng rồi.' },
    ],
  },
  {
    id: 'diary4', part: 'VI. Nhật ký 4', title: 'Video tin tức & ba hung án', time: '30–40 phút', lookup: 'cases',
    blocks: [
      { t: 'line', text: 'Trong nhật ký của mỗi người các bạn đều viết những chữ như phản bội, rời đi. Điều này khiến bất kỳ ai cũng không thể đoán thấu rốt cuộc đã xảy ra chuyện gì. Thế nhưng không lâu sau khi thiên nhật ký này được viết ra, một bản tin đã chấn động cả thành phố Giang Thành.' },
      { t: 'music', cue: 'news', text: 'Phát video Tin tức Giang Thành' },
      { t: 'music', cue: '08' },
      { t: 'action', text: 'Phát 6 tập hồ sơ “Vụ án giết người hàng loạt nghiêm trọng ở thành phố Giang Thành”.' },
      { t: 'warn', text: 'Mỗi vụ nên kết thúc trong 10–13 phút. Nếu người chơi muốn tìm hung thủ: “Ở giai đoạn này hung thủ không quan trọng, chỉ cần phá giải thủ pháp.”' },
      { t: 'line', text: 'Vụ 1: Cặp thi thể đầu tiên được phát hiện là Trương Chấn và Trương Văn Tĩnh, hai người chết tại nhà của Trương Chấn. Cảnh sát cho biết vụ án này đã hình thành một mật thất của người giám sát, hy vọng mọi người có thể dựa vào manh mối năm đó để phá giải thủ pháp gây án của hung thủ.' },
      { t: 'qa', q: 'Vụ 1 — điểm mấu chốt', a: '① Dùng chiếc ô đen (biến mất) móc lan can trèo lên sân thượng. ② Từ sân thượng nhảy vào phòng ngủ nhà hàng xóm đối diện tầng 6; tạo tiếng ồn + băng ghi âm tiếng kêu để thu hút/che giấu; bôi máu khắp sàn che dấu vết.' },
      { t: 'line', text: 'Không biết các bạn có để ý không, Trương Văn Tĩnh bị tạo thành tư thế chết giống như ‘tranh cát’, còn tiếng kêu thảm thiết của Trương Chấn kết hợp với chiếc máy ghi âm tại hiện trường, lại càng giống tư thế chết của ‘băng cát-xét’. Chúng ta tiếp tục vụ án thứ hai nhé.' },
      { t: 'line', text: 'Vụ 2: Hai nạn nhân của cặp thứ hai được phát hiện là Trần Vệ và Diệp Bội Bội, tại nhà của Diệp Bội Bội. Tương tự, hung thủ ở giai đoạn này không quan trọng.' },
      { t: 'qa', q: 'Vụ 2 — điểm mấu chốt', a: '① Diệp Bội Bội tự làm đá xay nhưng hũ đường/muối bị đựng ngược → mặn → đặt cốc khác, cốc có độc thành rác do shipper mang đi. ② Hôm đó cắt nước → dùng chai nước khoáng có độc đặt ở vị trí đầu tiên ngăn cao nhất tủ lạnh (cô cao 155cm).' },
      { t: 'note', text: 'Có thể mô phỏng cuộc gọi: DM đóng ông chủ quán chè, một người chơi đóng Diệp Bội Bội (“…Lần này xin lỗi nhé, lần sau nhất định…”).' },
      { t: 'line', text: 'Diệp Bội Bội chết do trúng độc đá xay đậu xanh, còn Trần Vệ bị dây thừng quấn quanh dẫn đến ngạt thở — chẳng phải rất giống tư thế chết của ‘dây tết hoa’ sao? Vẫn còn hai nạn nhân cuối cùng.' },
      { t: 'line', text: 'Vụ 3: Cặp thứ ba là Mã Tiểu Quân và Hà Hiểu Vân, chết tại nhà của Mã Tiểu Quân. Khi cảnh sát đến, phát hiện đã hình thành một mật thất.' },
      { t: 'qa', q: 'Vụ 3 — điểm mấu chốt', a: '① Tấm rèm lớn trong phòng ngủ (biến mất) làm dây thừng tẩu thoát qua ống khói. ② Xương chân của Hà Hiểu Vân làm thanh chống hình chữ T ở miệng ống khói; ra ngoài rồi đốt lò sưởi để tro mới phủ đều.' },
      { t: 'line', text: 'Hai mắt của Mã Tiểu Quân bị nhét vào hai quả cầu thủy tinh cực lớn, tương ứng với ‘bi thủy tinh’, còn xương của Hà Hiểu Vân bị tách rời, các mô còn lại bị nghiền thành dạng bùn rồi đắp lại thành hình người — ‘đất nặn’. Có thể xác định, tư thế chết của 6 người giống như ký hiệu giết người của hung thủ.' },
    ],
  },
  {
    id: 'reverse1', part: 'VI. Nhật ký 4', title: 'Đảo chiều thứ nhất — vòng tuần hoàn tình yêu', time: '25–30 phút', lookup: 'loop',
    blocks: [
      { t: 'music', cue: '09' },
      { t: 'line', text: 'Các người chơi, các bạn rất giỏi, đều đã tìm ra thủ pháp gây án của hung thủ, nhưng hung thủ giết các bạn lại là ai? Còn nhớ Nhật ký 4 các bạn đã viết không? Trong đó tràn ngập những chữ như ‘phản bội’, ‘rời đi’, thậm chí mỗi người đều nói phải dùng cách của mình để giữ lại người mình yêu, là giữ lại bằng hình thức gì?' },
      { t: 'line', text: 'Nhưng tôi phát hiện có một điểm rất kỳ lạ, Trương Chấn thích Diệp Bội Bội, nhưng lại chết cùng Trương Văn Tĩnh; Trần Vệ thích Hà Hiểu Vân, lại chết cùng Diệp Bội Bội; Mã Tiểu Quân thích Trương Văn Tĩnh, lại chết cùng Hà Hiểu Vân, chẳng phải rất kỳ quặc sao? Trừ phi, quan hệ của các bạn hoàn toàn không phải như các bạn nghĩ lúc ban đầu. Diệp Bội Bội, Hà Hiểu Vân và Trương Văn Tĩnh, lúc nãy các bạn dựa vào đâu để phán đoán người mình thích?' },
      { t: 'note', text: 'Cho 3 bạn nữ ~5 phút tự tìm “trò lừa tự sự” (tối đa 10 phút), rồi DM dẫn nhịp.' },
      { t: 'qa', q: 'Diệp Bội Bội thật sự thích ai?', a: 'Trần Vệ (cao 163, ngang tầm mắt; ngày nào cũng đưa người yêu về khu tập thể và mua đá xay đậu xanh). Trương Chấn cao 188.' },
      { t: 'qa', q: 'Trương Văn Tĩnh thật sự thích ai?', a: 'Trương Chấn (giọng giống cha — Diệp Kiến Quốc, mối tình non nớt năm xưa).' },
      { t: 'qa', q: 'Hà Hiểu Vân thật sự thích ai?', a: 'Mã Tiểu Quân (cao lớn 188, ở biệt thự phía nam).' },
      { t: 'qa', q: 'Vòng tuần hoàn', a: 'Trương Chấn → Diệp Bội Bội → Trần Vệ → Hà Hiểu Vân → Mã Tiểu Quân → Trương Văn Tĩnh → Trương Chấn.' },
      { t: 'line', text: 'Vậy rốt cuộc đóa hoa hồng mà các bạn vẽ để tỏ tình trong chuyến dã ngoại năm đó là tặng cho ai? Mời các bạn viết lên phần đầu bức tranh hoa hồng vừa vẽ: Tặng người tôi yêu XXX.' },
      { t: 'action', text: 'Trong lúc người chơi viết: DM vẽ BƯỚC 1–2 của sơ đồ hoa hồng lên bảng (tên lớp 1 xếp vòng tròn đối xứng; vẽ cánh hoa).' },
      { t: 'qa', q: 'Thứ tự giết theo vòng tuần hoàn', a: '1/5: Trương Văn Tĩnh giết Trương Chấn; Mã Tiểu Quân (xe máy, nhanh hơn ô tô kẹt mưa; nghe lén cuộc gọi) giết Trương Văn Tĩnh. Hà Hiểu Vân giết Mã Tiểu Quân; Trần Vệ (hàng xóm, nhìn thấy) giết Hà Hiểu Vân. 3/5: Diệp Bội Bội giết Trần Vệ; Trương Chấn (đã chết 1/5) hạ độc Diệp Bội Bội bằng chai nước khoáng — trì hoãn thời gian.' },
    ],
  },
  {
    id: 'letter', part: 'VII. Lượt chơi thứ hai', title: 'Thư của Hoan Hoan', time: '10 + 10 phút',
    blocks: [
      { t: 'music', cue: '10' },
      { t: 'line', text: 'Các vị, lượt chơi thứ nhất đã kết thúc, giờ đây các bạn đã dựa vào những manh mối ít ỏi còn sót lại để giải quyết được chân tướng đằng sau sáu vụ án mạng năm đó … 6 người họ, khi đối mặt với bài toán tình yêu, để giữ lại người mình yêu, đã chọn một cách vô cùng mới mẻ và khiến người ta không ngờ tới, nhưng điều đó thực sự đã đạt được hiệu quả, đóng băng tình yêu của họ mãi mãi ở thời Thiên Hy Niên. Các bạn cảm thấy họ dùng cách này để giữ lại người mình yêu thương, thì thế nào?' },
      { t: 'note', text: 'Tương tác nhẹ nhàng, cho người chơi thở phào sau hung án (có thể nói đùa). “Các bạn có thể hiểu họ không?”' },
      { t: 'line', text: 'Được rồi các vị, lượt chơi thứ hai sắp bắt đầu, nội dung là một bức thư, người gửi thư tên là Hoan Hoan.' },
      { t: 'action', text: 'Phát 6 cuốn “Thư của Hoan Hoan”.' },
      { t: 'music', cue: '11' },
      { t: 'line', text: '(Đọc xong) Các bạn cảm thấy Hoan Hoan là người như thế nào? … Các vị, chúng ta sắp bước vào lượt chơi thứ ba cuối cùng của trò chơi 《Mối Tình Thiên Niên Kỷ 2》, mời quét mã QR trong bức thư để vào trò chơi. Khi nhấn vào giao diện trò chơi mà không có nội dung mới xuất hiện, tức là phần tương tác của trò chơi đã hoàn thành.' },
      { t: 'action', text: 'Hướng dẫn quét QR trong thư → tự quay về đúng vai trên app (không cần nhập lại mã nếu cùng điện thoại).' },
    ],
  },
  {
    id: 'i1', part: 'VIII. Lượt chơi thứ ba', title: 'Giao diện 1 — Trò chơi ngọt ngào', time: '5 phút',
    blocks: [
      { t: 'open', stage: 'i1' },
      { t: 'line', text: '(Sau khi đọc xong) Họ ở trong thế giới trò chơi quả thật sống rất ngọt ngào nhỉ? Không có bất kỳ ai khác quấy rầy, có thể mãi mãi dừng lại ở thời đại họ yêu thích nhất, càng không có chuyện rời bỏ và phản bội lẫn nhau. Nếu là các bạn, các bạn có muốn đưa nửa kia của mình vào trong trò chơi không? Như vậy là có thể mãi mãi ở bên nhau rồi.' },
      { t: 'line', text: 'Đã là các bạn đều có suy nghĩ riêng, vậy chúng ta tiếp tục trò chơi này nhé. Tương tự, khi nhấn vào giao diện trò chơi mà không có nội dung mới xuất hiện, tức là phần tương tác của trò chơi đã hoàn thành.' },
    ],
  },
  {
    id: 'i2', part: 'VIII. Lượt chơi thứ ba', title: 'Giao diện 2 — Chủ nhân thật sự của nhật ký', time: '20–25 phút', lookup: 'owners',
    blocks: [
      { t: 'music', cue: '12' },
      { t: 'open', stage: 'i2' },
      { t: 'warn', text: 'Phải để người chơi hiểu thấu vai trò mới sau khi nhật ký bị đảo chiều, tránh rối về sau.' },
      { t: 'line', text: 'Các vị, lúc đầu các bạn thông qua nội dung ‘phòng chat’ để xác định ‘họ tên’, sau khi nhập vào cũng không có sai sót gì, vì vậy hãy quan sát kỹ giao diện mật khẩu, xem có thông tin gì mà chúng ta đã bỏ sót không.' },
      { t: 'line', text: 'Bên dưới đáp án có một câu thiếu chủ ngữ, chủ ngữ nên là gì? … Hóa ra đáp án các bạn nhập chính là chủ ngữ, nói cách khác, 6 đáp án thực ra là những ‘người bạn thân’ có hoàn cảnh giống với ‘chủ nhân thật sự của nhật ký’. Vậy người vừa có hoàn cảnh giống sáu nhân vật chính, lại xứng đáng là bạn thân, là ai? Có lẽ có thể tìm thấy đáp án trong Nhật ký 1.' },
      { t: 'qa', q: 'Tên lớp 2', a: 'Tranh Cát = Hồng Vũ · Đá Xay Đậu Xanh = Lưu Sấm · Đất Nặn = Lý Bằng · Dây Tết Hoa = Tôn Miêu Miêu · Bi Thủy Tinh = Hà Lị Lị · Băng Cát-xét = Phàn Diễm.' },
      { t: 'line', text: 'Tuy mật khẩu sai, nhưng những câu hỏi bảo mật này là do chủ nhân thật sự của nhật ký thiết lập, chỉ cần trả lời đúng mấy câu hỏi này, có lẽ sẽ biết được câu chuyện của chủ nhân thật sự của nhật ký.' },
      { t: 'note', text: 'Hỏi từng người đáp án câu hỏi bảo mật (Tra cứu → “Chủ nhân thật & câu hỏi bảo mật”), chốt từng người: “Chủ nhân của nhật ký X hẳn là Y, chứ không phải Z”.' },
      { t: 'action', text: 'Sau mỗi người: dùng BÚT ĐỎ viết tên lớp 2 lên bảng (BƯỚC 3 sơ đồ hoa hồng).' },
      { t: 'line', text: 'Vậy rốt cuộc bức tranh hoa hồng vẽ để tỏ tình vào ngày dã ngoại hôm đó là do ai vẽ? Mời lấy ra bức tranh hoa hồng các bạn vừa vẽ, ở chỗ ký tên hãy viết họ tên của người vẽ, cũng chính là người tỏ tình.' },
      { t: 'action', text: 'Trong lúc người chơi viết: vẽ BƯỚC 4–7 sơ đồ hoa hồng (ít nhất 2 màu đen & đỏ, nhìn rõ là một bông hồng).' },
      { t: 'line', text: '12 con người, nở rộ thành 6 đóa hồng kiều diễm, điên cuồng sinh trưởng, hòa quyện vào nhau, trở thành một phần của nhau.' },
      { t: 'qa', q: 'Quan hệ đã xác lập chưa?', a: 'Rồi — chuyến dã ngoại có 12 người (ngoài Tiếu Tiếu, Hoan Hoan); đầu Nhật ký 2 ai cũng nhớ về nó như kỷ niệm đẹp → cả 6 cặp đều thành đôi.' },
    ],
  },
  {
    id: 'reverse2', part: 'VIII. Lượt chơi thứ ba', title: 'Vụ án đảo chiều lần nữa', time: '15–20 phút', lookup: 'realkillers',
    blocks: [
      { t: 'warn', text: 'Lời thoại nhiều — đừng đọc máy móc, hãy giao lưu. DM mới dẫn 2 lượt đầu nên làm đúng quy trình sổ tay.' },
      { t: 'line', text: 'Đã là thân phận của chủ nhân nhật ký đã thay đổi, vậy giữa sáu người Trương Chấn, Diệp Bội Bội… cũng không tồn tại quan hệ tình yêu, không tồn tại động cơ giết người lẫn nhau, vì vậy logic vòng tuần hoàn giết người trước đó không còn đứng vững nữa; vậy hung thủ thật sự đã giết họ rốt cuộc là ai? Mọi người còn nhớ tư thế chết của Trương Chấn và những người khác không? Còn nhớ biệt danh ID của chủ nhân nhật ký không?' },
      { t: 'qa', q: 'Tư thế chết ↔ biệt danh', a: 'Trương Chấn = Băng Cát-xét · Diệp Bội Bội = Đá Xay Đậu Xanh · Trần Vệ = Dây Tết Hoa · Hà Hiểu Vân = Đất Nặn · Mã Tiểu Quân = Bi Thủy Tinh · Trương Văn Tĩnh = Tranh Cát.' },
      { t: 'qa', q: 'Vụ 1 (Trương Văn Tĩnh, Trương Chấn)', a: 'Lưu Sấm (hàng xóm đối diện — làm chứng giả) + Phàn Diễm (mời bạn thân Trương Văn Tĩnh đến).' },
      { t: 'qa', q: 'Vụ 2 (Mã Tiểu Quân, Hà Hiểu Vân)', a: 'Hồng Vũ (lập kế hoạch, kéo Hà Lị Lị lên ống khói bằng rèm) + Hà Lị Lị (mời chị họ đến, ra tay).' },
      { t: 'qa', q: 'Vụ 3 (Trần Vệ, Diệp Bội Bội)', a: 'Lý Bằng (nhân viên bán hàng chợ nông sản Vạn Hâm — cung cấp thuốc trừ sâu cho Lưu Sấm) + Tôn Miêu Miêu (người trong nhà, tráo hũ đường/muối, hạ độc).' },
      { t: 'line', text: 'Bây giờ mọi người đã rõ về chủ nhân thật sự của nhật ký, rốt cuộc ai yêu ai, và các hung án được hoàn thành như thế nào chưa?' },
      { t: 'line', text: 'Các bạn đã tiến gần đến chân tướng cuối cùng rồi … Được rồi, sắp tới chúng ta sẽ vào phần nhập vai sâu rồi, mọi người có thể đi vệ sinh hoặc hút điếu thuốc, quay lại chúng ta tiếp tục.' },
    ],
  },
  {
    id: 'i3', part: 'VIII. Lượt chơi thứ ba', title: 'Giao diện 3 — Đảo chiều cái chết của Tiếu Tiếu', time: '~10 phút', lookup: 'xiaodeath',
    blocks: [
      { t: 'music', cue: '13' },
      { t: 'open', stage: 'i3' },
      { t: 'line', text: '(Sau khi tương tác xong) Vậy, chân tướng cái chết của Tiếu Tiếu rốt cuộc là gì, ngoài Tưởng Văn ra, còn ai có động cơ giết Tiếu Tiếu?' },
      { t: 'qa', q: 'Ai còn có động cơ?', a: 'Hoan Hoan (động cơ của sáu người + thư của Hoan Hoan).' },
      { t: 'line', text: 'Nếu là Hoan Hoan giết Tiếu Tiếu, vậy cô ấy đã làm thế nào? Cô ấy chỉ vào tòa nhà dạy học có hai phút, mà chỉ riêng thời gian chặt đầu đã cần mười phút, toàn bộ quá trình ít nhất cũng cần 40 phút! Làm sao cô ấy có thể trong hai phút làm được những việc mà người bình thường cần 40 phút mới hoàn thành?' },
      { t: 'note', text: 'Sau 5 phút nếu chưa ai nghĩ ra: “Chỉ có một khả năng, đó là tất cả mọi người cùng mưu sát.” Hướng dẫn xem phần in đậm cuối Nhật ký 2.' },
      { t: 'qa', q: 'Sáu người đã làm gì?', a: 'Bi Thủy Tinh: quét dọn văn phòng Tưởng Văn, lấy mẩu giấy hẹn. Đất Nặn: bày danh sách mua sắm + chứng cứ trầm cảm ở phòng họp. Băng Cát-xét: ghi âm tiếng gương vỡ/đàn đổ ở phòng âm nhạc. Đá Xay Đậu Xanh: cắm đĩa ở phòng máy tính (trò chơi + ảnh “Hoa Hồng”). Tranh Cát: khiêng tượng thạch cao sang phòng y tế. Dây Tết Hoa: chặt cửa 10 phút che cho Hoan Hoan chặt đầu; giả ngất, mang đầu đi trong cặp sách lên xe cứu thương.' },
      { t: 'line', text: 'Không ngờ Tiếu Tiếu lại bị các bạn cùng nhau mưu sát, và đổ tội cho Tưởng Văn, thảo nào Tưởng Văn phải bỏ trốn … Các bạn quả nhiên là một đám kẻ điên si mê tình yêu, nhưng trò chơi vẫn chưa kết thúc, mời tiếp tục trò chơi.' },
    ],
  },
  {
    id: 'i4', part: 'VIII. Lượt chơi thứ ba', title: 'Giao diện 4 — Tìm nơi giấu đầu', time: '3 phút',
    blocks: [
      { t: 'open', stage: 'i4' },
      { t: 'action', text: 'Đột ngột TẮT ĐÈN — chỉ còn đèn nến tín hiệu và ánh sáng điện thoại.' },
      { t: 'line', text: 'Các vị, hãy nhanh chóng suy nghĩ xem, đầu của Tiếu Tiếu bây giờ rốt cuộc đang ở đâu?' },
      { t: 'qa', q: 'Đáp án', a: 'Vườn hoa hồng nhà Hoan Hoan (Thư Hoan Hoan trang 2, giữa trang 7). App có ô nhập đáp án + gợi ý nhẹ sau mỗi lần sai.', src: 'Gợi ý DM: “Nơi đó chắc chắn là nơi Hoan Hoan quen thuộc, hoặc là nơi cô ấy từng hứa hẹn điều gì đó với Tiếu Tiếu.”' },
      { t: 'line', text: 'Mời tiếp tục trò chơi, đi đến vườn hoa hồng đó.' },
    ],
  },
  {
    id: 'i5', part: 'VIII. Lượt chơi thứ ba', title: 'Giao diện 5 — Bí mật của chiếc đầu', time: '2 phút',
    blocks: [
      { t: 'open', stage: 'i5' },
      { t: 'line', text: 'Các vị! Không còn nhiều thời gian nữa! Vết dao trên đầu Tiếu Tiếu là do hung khí gì gây ra?!' },
      { t: 'qa', q: 'Đáp án', a: 'Lưỡi dao trên giày trượt băng (cuối tiểu chương 【Hoan Hoan và Tiếu Tiếu】 NK1, trang 9 thư Hoan Hoan).' },
      { t: 'line', text: 'Được, mọi người hãy nhanh chóng bắt đầu giao diện trò chơi cuối cùng.' },
    ],
  },
  {
    id: 'i6', part: 'VIII. Lượt chơi thứ ba', title: 'Giao diện 6 — Tưởng Văn xuất hiện', time: '2 + 20 phút', lookup: 'invites',
    blocks: [
      { t: 'music', cue: '14' },
      { t: 'open', stage: 'i6' },
      { t: 'line', who: 'Tưởng Văn (cười gian, âm u)', text: 'Công nghệ AI quả nhiên mạnh mẽ, không ngờ lại khiến ý thức của những nhân vật này thức tỉnh triệt để đến vậy, bây giờ, các người có biết ta là ai không?' },
      { t: 'note', text: 'Người chơi nhớ lại việc DM nói sai màu sắc → phản ứng ra.' },
      { t: 'line', who: 'Tưởng Văn', text: 'Không sai, ta chính là Tưởng Văn, hai mươi năm trước, sau khi Tiếu Tiếu bị hại, gần như mọi chứng cứ đều chĩa về phía ta, ta có trăm miệng cũng không cãi được, chỉ có thể chọn cách bỏ trốn. Cho đến hôm nay, ta đã dốc hết tâm tư thay thế NPC trong trò chơi, dùng chương trình AI khiến ý thức của những nhân vật trò chơi này thức tỉnh, thông qua miệng của chúng, cuối cùng đã tìm thấy đầu của Tiếu Tiếu và hung khí đã giết Tiếu Tiếu năm đó, chỉ cần ta nộp cho cảnh sát, là có thể chứng minh Tiếu Tiếu hoàn toàn không phải do ta giết! Mà là con nhỏ Yến Hoan Hoan đó! Cuối cùng! Ta — kẻ đã sống trong bóng tối suốt 20 năm! Cuối cùng cũng được nhìn thấy ánh mặt trời lần nữa!' },
      { t: 'line', who: 'Tưởng Văn (xảo quyệt)', text: 'Đương nhiên, hôm nay ta còn có một mục đích khác…… Bây giờ, tuy các người vẫn đang kết nối với giao diện não–máy, nhưng hẳn đã có thể nhớ ra mình là ai rồi chứ? Dù sao thì, trò chơi này được tạo ra lấy các người làm nguyên mẫu, hãy xem thư mời Yến Hoan Hoan viết cho các người đi……' },
      { t: 'qa', q: 'Thư mời → thân phận thật', a: 'Số 1 Hồng Vũ · Số 2 Lưu Sấm · Số 3 Lý Bằng · Số 4 Tôn Miêu Miêu · Số 5 Hà Lị Lị · Số 6: từ trại trẻ mồ côi — con gái Tiếu Tiếu.' },
      { t: 'line', who: 'Tưởng Văn (hơi biến thái)', text: 'Không sai, năm vị các người quả thực là năm người năm đó, (nhìn người chơi số 6) còn cô thì sao? Là Phàn Diễm à? … Cô đương nhiên không thể là Phàn Diễm, Phàn Diễm thật sự từ lâu đã qua đời vì bệnh, vậy thì, cô là ai? Đáp án này trên thế giới này, ngoài Yến Hoan Hoan ra, cũng chỉ có ta biết thôi!' },
      { t: 'line', who: 'Tưởng Văn (thâm tình)', text: 'Mấy chục năm trước, có một cậu bé theo cha mẹ chuyển công tác đến Giang Thành … bẩm sinh đã bị cận thị, hơn nữa còn mắc chứng rối loạn sắc giác nghiêm trọng … Cô gái là người đầu tiên phát hiện ra vấn đề của cậu bé, lặng lẽ để lại vở ghi chép của mình trên bàn học của cậu … Hai người hẹn nhau cùng thi đỗ một trường đại học … Nhưng cô gái thi đỗ, còn cậu bé lại thi trượt … Hai người xảy ra tranh cãi, và cậu bé đã lỡ tay giết chết người yêu của mình. Cậu bé trong câu chuyện chính là ta. Cô ấy tên là Hoa Hồng. Đây là bức chân dung ta vẽ cho Hoa Hồng, giờ đây bức tranh này đã vỡ vụn, nếu các người có thể khôi phục bức tranh này, thì sẽ biết được toàn bộ chân tướng.' },
      { t: 'action', text: 'Phát 12 mảnh ảnh phác họa người chơi số 6 (mỗi người 2 mảnh) để ghép. Mặt sau: “Ta như hoa hồng, lớn lên trong bóng ngược sáng, hướng về cái chết mà sống”.' },
      { t: 'line', who: 'Tưởng Văn (đứng sau người chơi số 6, ghé sát tai)', text: 'Ngay từ khi bước vào trò chơi này hôm nay, ta đã biết cô là ai! Quả thật giống hệt như Hoa Hồng và Tiếu Tiếu … Những ngày tháng năm ấy, ta không phải là cha, cũng không phải là đàn ông, mà là một người làm vườn hèn mọn, cố gắng lấy Tiếu Tiếu làm đất, để đóa hồng của ta một lần nữa nở rộ … Các người còn nhớ Tiếu Tiếu từng bảo lưu một năm thời cấp hai chứ? … Ta đã giam cầm nó, đánh thuốc mê nó, bỏ ra một cái giá lớn để thụ tinh nhân tạo, từ trong vũng bùn này đã sinh ra một đóa hồng mới! Và đóa hồng mới sinh này, chính là cô đó!' },
      { t: 'line', who: 'Tưởng Văn', text: 'Nhưng, Tiếu Tiếu càng ngày càng không nghe lời … Yến Hoan Hoan mới là kẻ điên thực sự, nó lại trực tiếp giết chết Tiếu Tiếu. Nhưng, đối với cái chết của Tiếu Tiếu, ta rốt cuộc vẫn có chút không hiểu.' },
      { t: 'action', text: 'Phát thẻ D1: Email hồi âm của trường đại học Đan Mạch.' },
      { t: 'line', who: 'Tưởng Văn', text: 'Đã là Tiếu Tiếu biết mình không thể sang Đan Mạch, tại sao vẫn nói thẳng với Yến Hoan Hoan là sẽ đi Đan Mạch? … Hung thủ vận chuyển thi thể từ văn phòng đến phòng y tế ít nhất cần năm phút … nó chỉ ở lại tòa nhà dạy học vỏn vẹn có hai phút, độ chênh lệch ba phút này là chí mạng … Trong tòa nhà dạy học này, nhất định còn tồn tại một người giúp đỡ Hoan Hoan! Câu “Hướng về cái chết mà sống, đi ngược ánh sáng” mà Tiếu Tiếu để lại rốt cuộc có ý nghĩa gì?' },
      { t: 'warn', text: 'Nếu người chơi nói “đánh ngã ngay ở cửa”: phủ nhận — lúc 6:50 rời văn phòng ta không thấy gì bất thường ở hành lang.' },
      { t: 'qa', q: 'Đáp án', a: 'Người giúp sức cuối cùng chính là Tiếu Tiếu: cô tự ĐI LÙI từ văn phòng Tưởng Văn đến trước mặt Hoan Hoan, chủ động đi tìm cái chết → dấu chân như đi từ cổng chính về cổng sau.' },
      { t: 'line', who: 'Tưởng Văn', text: 'Không ngờ đóa hồng ta yêu sâu đậm, lại có thể vì một cô gái muốn giết mình mà đi chết. Mãi đến hai mươi năm sau, ta mới tình cờ tìm thấy một chiếc đĩa, bên trong là giọng nói của Tiếu Tiếu để lại từ hai mươi năm trước.' },
      { t: 'music', cue: '15' },
      { t: 'music', cue: '16', text: 'Sau khi đoạn ghi âm kết thúc' },
      { t: 'line', who: 'Tưởng Văn (bệnh kiều)', text: 'Thật là một câu hướng về cái chết mà sống! Đi giật lùi, điểm xuất phát và điểm kết thúc của nó đã hoán đổi cho nhau, vừa trao tội danh cho ta, lại vừa rửa sạch nghi ngờ cho Yến Hoan Hoan … Đóa hồng cũ đã khô héo, trở thành phân bón, đóa hồng mới tái sinh từ thi thể của nó, sắc màu sẽ chỉ càng thêm kiều diễm rực rỡ, đó là sắc đỏ còn đẹp hơn cả máu, hơn cả lửa!' },
      { t: 'action', text: 'Lấy cành hoa hồng, quỳ một gối trước người chơi số 6.' },
      { t: 'line', who: 'Tưởng Văn', text: 'Đóa hồng mới sinh ơi, ta mai danh ẩn tích, trốn tránh nhiều năm, chính là vì khoảnh khắc hôm nay, được gặp lại sự nở rộ của em. Em — người đã biết toàn bộ chân tướng — hẳn có thể cảm nhận được tình cảm của ta chứ, ta nguyện làm ánh mặt trời của em, nước mưa của em, không khí của em, chỉ cần em có thể nở rộ trong sinh mệnh của ta! Hoa Hồng thân yêu, em có bằng lòng, một lần nữa lấy ta không?' },
      { t: 'note', text: 'Tương tác ~1 phút; có thể hỏi những người khác có muốn làm người chứng hôn không.' },
      { t: 'line', who: 'Nếu đồng ý', text: 'Hoa Hồng, cuối cùng chúng ta lại có thể ở bên nhau rồi! Sau khi chương cuối của trò chơi kết thúc, em phải nhớ lời hứa vừa rồi của em đấy.' },
      { t: 'line', who: 'Nếu không đồng ý', text: 'Hoa Hồng, ta biết bây giờ em chưa thể chấp nhận ta nhanh như vậy, không sao, ta sẵn lòng chờ em, sau khi chương cuối của trò chơi kết thúc, hãy cho ta câu trả lời của em một lần nữa.' },
      { t: 'music', cue: '17' },
    ],
  },
  {
    id: 'final', part: 'IX. Chương cuối', title: 'Chương cuối của trò chơi — bỏ phiếu', time: '10 phút',
    blocks: [
      { t: 'open', stage: 'final' },
      { t: 'line', who: 'Tưởng Văn', text: 'Không ngờ Yến Hoan Hoan còn để lại một ‘quả trứng phục sinh’ ẩn giấu, lại giao việc có tắt trò chơi hay không cho chính các người quyết định; nhưng ta cũng rất tò mò, sau khi biết toàn bộ chân tướng, các người rốt cuộc sẽ đưa ra lựa chọn như thế nào. Các người hãy nhớ, chỉ khi đèn nến tín hiệu của tất cả các người đều tắt hết, trò chơi mới hoàn toàn bị tắt, nếu không, trò chơi sẽ tiếp tục vận hành. Có thể cho các người vài phút để bàn bạc, sau đó, đưa ra lựa chọn của mỗi người.' },
      { t: 'note', text: 'Để người chơi tự trò chuyện, nói lý do tắt / không tắt. Tưởng Văn có thể hỏi từng người.' },
      { t: 'action', text: 'Đếm ngược — người chơi đưa ra lựa chọn cuối cùng bằng đèn nến tín hiệu.' },
    ],
  },
  {
    id: 'ending', part: 'X. Kết cục', title: 'Kết cục & lời kết', time: '5 phút', lookup: 'endings',
    blocks: [
      { t: 'music', cue: '18', text: 'Nếu đèn nến tín hiệu CHƯA tắt hết' },
      { t: 'music', cue: '19', text: 'Nếu đèn nến tín hiệu tắt hết' },
      { t: 'action', text: 'Bấm kết cục tương ứng ở trang Điều khiển (mục Kết cục) → điện thoại người chơi hiện màn hình kết cục, có thể lưu ảnh.' },
      { t: 'music', cue: '20', text: 'Sau khi âm thanh kết cục kết thúc' },
      { t: 'line', who: 'Nếu Kết cục 1', text: 'Các học trò thân yêu của ta, Hoa Hồng thân yêu của ta, trò chơi có tiếp tục vận hành hay không chẳng hề quan trọng, quan trọng là chúng ta phải cùng nhau giữ kín bí mật này, như vậy các người mới có thể sống mãi trong trò chơi cùng người yêu của mình. Còn ta, (nhìn người chơi số 6, cười bệnh kiều) sẽ dùng quãng đời còn lại, hết lòng yêu thương đóa hồng của ta, cho đến khi, gieo trồng thêm nhiều đóa hồng hơn nữa……' },
      { t: 'line', who: 'Nếu Kết cục 2', text: 'Các học trò thân yêu của ta, không ngờ các người lại nhát gan như vậy, tình yêu của các người thật quá nhỏ bé, nhưng các người đối với ta cũng chẳng quan trọng. (Nhìn người chơi số 6) Hoa Hồng thân yêu của ta, ta sẽ dùng quãng đời còn lại, mãi mãi âm thầm ở bên em, cho đến khi, chúng ta cùng nhau gieo trồng thêm nhiều đóa hồng hơn nữa……' },
      { t: 'line', who: 'Thoát vai', text: 'Cảm ơn mọi người đã đến quán kịch bản sát XXX, trải nghiệm 《Mối Tình Đẫm Máu》, tôi là Tưởng Văn, cũng là DM XXX của ngày hôm nay. Trên điện thoại của các bạn đã xuất hiện kết cục mà các bạn lựa chọn, có thể tùy chỉnh dòng chữ để lưu lại làm kỷ niệm nhé~' },
    ],
  },
];
