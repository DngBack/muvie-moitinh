import 'server-only';
/**
 * ĐÁP ÁN — chỉ chạy trên server (API /api/check), không gửi xuống trình duyệt người chơi.
 * So khớp đã bỏ dấu, không phân biệt hoa thường, nên người chơi gõ "Ma Tieu Quan" cũng đúng.
 *  - name: phải trùng toàn bộ tên.
 *  - keywords: câu trả lời chỉ cần CHỨA một trong các cụm từ.
 *    Tiền tố "$": từ cuối cùng của câu trả lời phải đúng từ đó.
 */
export const NAME_L1: Record<number, string[]> = {
  1: ['Mã Tiểu Quân'], 2: ['Trương Chấn'], 3: ['Trần Vệ'],
  4: ['Diệp Bội Bội'], 5: ['Hà Hiểu Vân'], 6: ['Trương Văn Tĩnh'],
};

export const NAME_L2: Record<number, string[]> = {
  1: ['Hồng Vũ'], 2: ['Lưu Sấm'], 3: ['Lý Bằng'],
  4: ['Tôn Miêu Miêu'], 5: ['Hà Lị Lị', 'Hà Li Li', 'Hà Lỵ Lỵ'], 6: ['Phàn Diễm'],
};

export const SECURITY_KEYWORDS: Record<number, string[][]> = {
  1: [
    ['Hồng Kim Khuê'],
    ['Singapore', 'Sing', 'Xin ga po', 'Tân Gia Ba', 'Singapo', 'nước ngoài'],
    ['đau khổ', 'không còn đau', 'quên đau', 'nỗi đau', 'cô độc', 'nhớ mẹ'],
    ['Mã Tiểu Quân'],
  ],
  2: [
    ['Lưu Cương'],
    ['Trương Chấn'],
    ['$Hồ'],
    ['Lưu Cương', 'nghỉ việc', 'phản đối', 'tai nạn', 'qua đời', 'chết', 'mất'],
  ],
  3: [
    ['Lý Minh Sơn'],
    ['cổ đông', 'tổng giám đốc', 'giám đốc', 'Vạn Hâm', 'ông chủ', 'tập đoàn'],
    ['bóng rổ'],
    ['đội trưởng', 'đội phó', 'thủ lĩnh', 'dẫn dắt', 'trưởng'],
  ],
  4: [
    ['Tôn Hải'],
    ['Diệp Kiến Quốc'],
    ['bụi phổi', 'bệnh phổi', 'phổi'],
    ['bụi phổi', 'bệnh phổi', 'phổi', 'cha mẹ ruột', 'bố mẹ ruột', 'bố mẹ', 'cha mẹ'],
  ],
  5: [
    ['Hà Vũ'],
    ['bi a', 'bia', 'bida', 'billiard', 'bi da'],
    ['chè', 'quán chè', 'che'],
    ['bi thủy tinh', 'bắn bi', 'bi a', 'bida', 'bi da', 'bi'],
  ],
  6: [
    ['Diệp Kiến Quốc'],
    ['giọng', 'giọng nói', 'giọng hát', 'âm thanh'],
    ['Phàn', 'giám đốc Phàn', 'Phàn Lập Trung', 'giám đốc nhà máy'],
    ['giọng', 'giống', 'ký ức', 'giọng nói'],
  ],
};

export const GATE_KEYWORDS = {
  head: ['hoa hồng', 'vườn hồng', 'vườn hoa', 'gốc hồng', 'nhà hoan hoan'],
  weapon: ['trượt băng', 'giày trượt', 'lưỡi trượt', 'giày băng', 'dao trượt'],
};
