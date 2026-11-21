/** Câu hỏi bảo mật (Giao diện 2) — hiển thị cho người chơi. Đáp án nằm ở server (src/server/answers.ts). */
export const SECURITY_QUESTIONS: Record<number, string[]> = {
  1: ['Tên của cha tôi là?', 'Mẹ tôi đã đi đâu?', 'Lý do tôi đam mê hội họa là?', 'Ai là người bạn tốt nhất đồng thời là đối thủ lớn nhất của tôi?'],
  2: ['Tên của cha tôi là?', 'Đối diện nhà tôi ai sống?', 'Mẹ tôi họ gì?', 'Gia đình tôi đã gặp phải bất hạnh gì?'],
  3: ['Tên của cha tôi là?', 'Công việc của cha tôi là?', 'Tôi tham gia câu lạc bộ nào ở trường?', 'Tôi giữ chức vụ gì trong câu lạc bộ này?'],
  4: ['Bố ruột của tôi là ai?', 'Tên của cha tôi là?', 'Căn bệnh tôi ghét nhất là?', 'Vì sao tôi lại đồng cảm với những công nhân mắc bệnh của nhà máy sợi hóa học?'],
  5: ['Tên của cha tôi là?', 'Cửa tiệm nhà tôi kinh doanh gì?', 'Cửa tiệm đối diện nhà tôi kinh doanh gì?', 'Sở thích của tôi là gì?'],
  6: ['Mối tình đầu của tôi là ai?', 'Lý do tôi yêu mối tình đầu?', 'Cha tôi là ai?', 'Vì sao tôi lại yêu người thứ hai?'],
};

export const DIARY_HINT_SENTENCE = 'Ai có hoàn cảnh giống tôi sẽ trở thành bạn thân của tôi';

export const L2_HINTS = [
  'Gợi ý: Tên bạn nhập lần trước không sai — hãy đọc kỹ câu gợi ý bên dưới ô nhập. Câu đó đang thiếu chủ ngữ.',
  'Gợi ý: “[Tên bạn đã nhập] có hoàn cảnh giống tôi, sẽ trở thành bạn thân của tôi.” — vậy “tôi” là ai? Hãy tìm trong Nhật ký 1.',
];
