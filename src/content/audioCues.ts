/**
 * Âm thanh & video theo sổ tay. File thật được DM upload vào từng slot (Supabase Storage).
 * Với các cue giọng nói chưa có file, app hiển thị văn bản để DM đọc trực tiếp
 * hoặc dùng giọng đọc của trình duyệt (TTS tiếng Việt).
 */
export type CueKind = 'bgm' | 'sfx' | 'voice' | 'video';

export interface Cue {
  id: string;
  /** khóa trong bảng assets */
  key: string;
  no: string;
  name: string;
  original?: string;
  kind: CueKind;
  when: string;
  /** văn bản giọng đọc (nếu có) */
  script?: string[];
}

const c = (no: string, name: string, kind: CueKind, when: string, extra: Partial<Cue> = {}): Cue => ({
  id: no, key: `cue_${no}`, no, name, kind, when, ...extra,
});

export const CUES: Cue[] = [
  c('01', 'Trò chơi bắt đầu', 'voice', 'Người chơi vào phòng tối — làm theo hướng dẫn để vào chỗ và bật đèn nến tín hiệu', {
    original: '游戏开始',
    script: [
      'Chào mừng các bạn đến với thử nghiệm nội bộ 《Mối Tình Thiên Niên Kỷ 2》.',
      'Hãy tìm chỗ ngồi có cuốn kịch bản mang biệt danh của mình. Đừng mở kịch bản.',
      'Bật ngọn đèn nến bên cạnh bạn. Đó là đèn tín hiệu của bạn.',
      'Khi đèn tín hiệu sáng lên, giao diện não–máy sẽ được kết nối, ký ức thật của bạn sẽ tạm thời biến mất.',
      'Trong suốt trò chơi, tuyệt đối không được tắt đèn tín hiệu.',
    ],
  }),
  c('02', 'Hi', 'bgm', 'Sau âm thanh 01 — bật đèn, DM chào mở màn'),
  c('03', 'Yêu QQ', 'bgm', 'Phòng chat QQ — tìm tên tương ứng', { original: 'QQ爱' }),
  c('04', 'Chuột yêu gạo', 'bgm', 'Nhật ký 1 — chia sẻ, tỏ tình, vẽ hoa hồng', { original: '老鼠爱大米' }),
  c('05', 'Hiệu ứng kinh dị cảnh ảo', 'bgm', 'Nhật ký 2 — đột ngột tắt đèn, cái chết của Tiếu Tiếu', { original: '虚拟场景惊悚音效' }),
  c('06', 'Promise', 'bgm', 'Nhật ký 3 — bật đèn, đọc nhật ký'),
  c('07', 'Phát thanh của trường', 'voice', 'Sau khi đọc xong Nhật ký 3 (xong thì chuyển lại 06)', {
    original: '学校广播',
    script: [
      'Toàn thể thầy trò chú ý, toàn thể thầy trò chú ý, sau đây là một thông báo quan trọng:',
      'Trương Chấn, Diệp Bội Bội, Trần Vệ, Hà Hiểu Vân, Mã Tiểu Quân, Trương Văn Tĩnh — sáu thành viên đang theo học tại trường đã vi phạm nghiêm trọng nội quy, kỷ luật của nhà trường, đi ngược thuần phong mỹ tục, gây ảnh hưởng xấu đến nề nếp của trường ta.',
      'Nhà trường tuyệt đối không dung túng, không bao che cho những hành vi xấu này. Ban lãnh đạo nhà trường đã nhất trí quyết định, kể từ hôm nay đuổi học sáu thành viên nêu trên, mong toàn thể thầy trò lấy đó làm bài học.',
    ],
  }),
  c('news', 'Video: Tin tức Giang Thành', 'video', 'Sau khi đọc xong Nhật ký 4 (Máy chiếu > TV > Máy tính bảng > Điện thoại)', { original: '江城新闻' }),
  c('08', 'Simian dawn', 'bgm', 'Ba hung án trong tập hồ sơ'),
  c('09', 'the core of a matter', 'bgm', 'Nhanh chóng khôi phục lại quan hệ nhân vật'),
  c('10', 'jason edit — your love', 'bgm', 'Lượt chơi thứ hai — mở đầu'),
  c('11', 'green to blue', 'bgm', 'Phát “Thư của Hoan Hoan”'),
  c('12', 'who is zero', 'bgm', 'Giao diện 2 — đảo chiều chủ nhân nhật ký'),
  c('13', 'the gortto', 'bgm', 'Giao diện 3 — đảo chiều cái chết của Tiếu Tiếu'),
  c('14', 'Main title', 'bgm', 'Giao diện 6 — Tưởng Văn xuất hiện'),
  c('15', 'Đoạn ghi âm của Tiếu Tiếu', 'voice', 'Sau khi người chơi đoán ra Tiếu Tiếu tự “đi ngược” đến chỗ Hoan Hoan', {
    original: '笑笑的音频',
    script: [
      'Hoan Hoan, lúc cậu nghe được đoạn ghi âm này, có lẽ tớ đã không còn trên thế giới này nữa rồi.',
      'Adonis từng nói: “Hoa hồng là chiếc đầu sinh ra để bị chặt lìa.” Lớn lên trong bóng ngược sáng, hướng về cái chết mà sống, là số mệnh của tớ; nếu mùa hoa của tớ rồi cũng sẽ tàn lụi, tớ mong người tự tay bẻ gãy tớ là cậu — người tớ yêu nhất.',
      'Tớ là người hiểu cậu nhất trên đời này, sao lại không rõ những điều thầm kín trong lòng cậu chứ? Mấy ngày đó, ánh mắt cậu nhìn tớ không chỉ để lộ tình yêu, mà còn cả sát ý nồng đậm; cậu hẹn gặp tớ ở phòng y tế cổng Đông, nhưng tớ lại thấy cậu lén tháo lưỡi dao trên đôi giày trượt băng tớ tặng cậu xuống, bỏ vào trong túi, tớ liền biết, cuối cùng cậu đã chuẩn bị dùng cái chết để giữ tớ lại; nhưng tớ không sợ, ngược lại còn cảm thấy hạnh phúc, vì đây là cách cậu bày tỏ tình yêu cao nhất, cái chết không phải là chiếm hữu, mà là cùng cậu chung sống.',
      'Thật ra, chuyến đi Đan Mạch là điều bất ngờ tớ muốn dành cho cậu, vì ở Đan Mạch, hôn nhân đồng giới đã được hợp pháp hóa. Ở nơi đó, chúng ta sẽ có hôn lễ thuộc về riêng mình. Nhưng, vì bị trầm cảm kéo dài, trường Đan Mạch đã từ chối đơn xin học của tớ. Đối với tớ mà nói, nếu không thể thoát khỏi Tưởng Văn, thì tớ cam tâm tình nguyện dùng cái chết để mãi mãi bên cậu, vĩnh viễn không chia lìa.',
      'Vì vậy, hôm đó tớ cũng hẹn Tưởng Văn gặp ở trường, sau khi tớ rời khỏi văn phòng của hắn, tớ sẽ giẫm lên nước mưa ở cổng Tây, quay lưng bước về phía cậu; hành lang dài như con đường đời của tớ, tớ sẽ đi ngược ánh sáng, đây vừa là con đường sống tớ để lại cho cậu, cũng là con đường chết tớ tặng cho Tưởng Văn. Tớ không nhìn thấy ánh mắt của cậu, nhưng tớ tin cậu tuyệt đối sẽ không mềm lòng, tớ tin vào tình yêu cậu dành cho tớ. Nhất định phải một đòn chí mạng, không chút nương tay mà giết chết tớ.',
      'Hạt giống mà Tưởng Văn gieo trong cơ thể tớ, đã được tớ giấu ở trại trẻ mồ côi Giang Thành; trong người con bé chảy dòng máu của Tưởng Văn, vì vậy tớ không thể yêu con bé, nhưng con bé cũng chỉ là một sinh mệnh vô tội, tớ cũng không thể hận con bé. Tớ quyết định giao phó con bé cho cậu, người yêu của tớ, lần này, xin hãy tha thứ cho sự ích kỷ của tớ.',
    ],
  }),
  c('16', "Kyomi's Lullaby", 'bgm', 'Sau đoạn ghi âm — Tưởng Văn cầu hôn “Hoa Hồng”'),
  c('17', 'Chương cuối của trò chơi', 'voice', 'Sau màn cầu hôn — rồi DM mở “Chương cuối”', {
    original: '游戏终章',
    script: [
      'Hệ thống nhắc nhở! Hệ thống nhắc nhở!',
      'Chương cuối của trò chơi đã tải xong, chương cuối của trò chơi đã tải xong, mời tiến hành màn hình trò chơi cuối cùng.',
    ],
  }),
  c('18', 'Kết cục 1 — Đóa hồng mới', 'voice', 'Nếu đèn nến tín hiệu CHƯA tắt hết', {
    original: '结局一',
    script: [
      'Đèn nến tín hiệu không tắt hết, các người đã chọn để trò chơi tiếp tục vận hành; năm người trong sự kiện Thiên Hy Niên vì thế mà chứng nghiện ngày càng nghiêm trọng, cuối cùng lần lượt kết thúc sinh mệnh của mình, bước vào thế giới trò chơi, thực sự đoàn tụ với người yêu của mình.',
      'Còn người quản lý trò chơi mới, bí danh “Hoa Hồng”, đang dốc sức giúp đỡ những cặp tình nhân đã nếm trải đủ nỗi khổ tình yêu trong hiện thực, khai mở một vùng đất thuần khiết của tình yêu thuần túy; người quản lý trò chơi “Hoa Hồng” đã nói như thế này:',
      'Tình yêu là cưỡng ép, là lời mời không thể khước từ, lấy tình yêu làm lồng giam, dung chứa những ràng buộc của nhau, cho đến vĩnh hằng, hướng về cái chết mà sống.',
    ],
  }),
  c('19', 'Kết cục 2 — Trở về hiện thực', 'voice', 'Nếu đèn nến tín hiệu tắt hết', {
    original: '结局二',
    script: [
      'Đèn nến tín hiệu tắt hết, tất cả mọi người thoát khỏi giao diện não–máy, trở về hiện thực. Năm người trong sự kiện Thiên Hy Niên dần dần tỉnh lại khỏi chứng nghiện, họ nhận ra những tổn thương mà hành vi của mình đã gây ra cho người yêu, lần lượt ra đầu thú; chân tướng sự kiện Thiên Hy Niên cuối cùng đã được vạch trần, một lần nữa chấn động cả nước, những cuộc bàn luận về thế nào là tình yêu trở thành chủ đề nóng lúc bấy giờ,',
      'trên một diễn đàn mạng, bài đăng của một tài khoản có ID “Hoa Hồng” đã trở thành câu trả lời được nhiều lượt thích nhất:',
      'Tình yêu là tự do, là cam tâm tình nguyện lao đến, cho dù mỗi chúng ta rồi sẽ quay về với chính mình, cho dù nó ngắn ngủi mà lại tươi sống.',
    ],
  }),
  c('20', 'permafrost', 'bgm', 'Sau âm thanh kết cục — DM diễn lời kết và thoát vai'),
];

export function cueById(id: string) {
  return CUES.find((x) => x.id === id);
}

/** Các slot ảnh nền cảnh có thể thay bằng ảnh thật */
export const SCENE_SLOTS: { key: string; name: string; usedIn: string }[] = [
  { key: 'bg_login', name: 'Màn nhập mã khóa', usedIn: 'Màn đăng nhập người chơi' },
  { key: 'bg_chat', name: 'Phòng chat', usedIn: 'Lượt chơi thứ nhất' },
  { key: 'bg_path', name: 'Con đường về nhà', usedIn: 'Giao diện 1, 2' },
  { key: 'bg_school', name: 'Tòa nhà dạy học (glitch)', usedIn: 'Giao diện 3, 4' },
  { key: 'bg_garden', name: 'Vườn hoa hồng', usedIn: 'Giao diện 5' },
  { key: 'bg_room', name: 'Căn phòng cũ', usedIn: 'Giao diện 6, Kết cục “Tiếp tục”' },
  { key: 'bg_field', name: 'Cánh đồng hoa hồng Đan Mạch', usedIn: 'Chương cuối' },
  { key: 'bg_void', name: 'Màn tối glitch', usedIn: 'Kết cục “Tắt trò chơi”' },
];
