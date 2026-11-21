import type { Ending } from '@/lib/types';

export const ENDINGS: Record<Ending, { title: string; dmLabel: string; text: string[]; quote: string; cue: string }> = {
  continue: {
    title: 'Kết cục 1: Đóa hồng mới',
    dmLabel: 'Tiếp tục trò chơi',
    cue: '18',
    text: [
      'Đèn nến tín hiệu không tắt hết, các người đã chọn để trò chơi tiếp tục vận hành; năm người trong sự kiện Thiên Hy Niên vì thế mà chứng nghiện ngày càng nghiêm trọng, cuối cùng lần lượt kết thúc sinh mệnh của mình, bước vào thế giới trò chơi, thực sự đoàn tụ với người yêu của mình.',
      'Còn người quản lý trò chơi mới, bí danh “Hoa Hồng”, đang dốc sức giúp đỡ những cặp tình nhân đã nếm trải đủ nỗi khổ tình yêu trong hiện thực, khai mở một vùng đất thuần khiết của tình yêu thuần túy; người quản lý trò chơi “Hoa Hồng” đã nói như thế này:',
    ],
    quote: 'Tình yêu là cưỡng ép, là lời mời không thể khước từ, lấy tình yêu làm lồng giam, dung chứa những ràng buộc của nhau, cho đến vĩnh hằng, hướng về cái chết mà sống.',
  },
  off: {
    title: 'Kết cục 2: Trở về hiện thực',
    dmLabel: 'Tắt trò chơi',
    cue: '19',
    text: [
      'Đèn nến tín hiệu tắt hết, tất cả mọi người thoát khỏi giao diện não–máy, trở về hiện thực. Năm người trong sự kiện Thiên Hy Niên dần dần tỉnh lại khỏi chứng nghiện, họ nhận ra những tổn thương mà hành vi của mình đã gây ra cho người yêu, lần lượt ra đầu thú; chân tướng sự kiện Thiên Hy Niên cuối cùng đã được vạch trần, một lần nữa chấn động cả nước, những cuộc bàn luận về thế nào là tình yêu trở thành chủ đề nóng lúc bấy giờ,',
      'trên một diễn đàn mạng, bài đăng của một tài khoản có ID “Hoa Hồng” đã trở thành câu trả lời được nhiều lượt thích nhất:',
    ],
    quote: 'Tình yêu là tự do, là cam tâm tình nguyện lao đến, cho dù mỗi chúng ta rồi sẽ quay về với chính mình, cho dù nó ngắn ngủi mà lại tươi sống.',
  },
};

export const DEFAULT_CUSTOM_LINE = 'Sao cậu lại… không nghe lời!';
