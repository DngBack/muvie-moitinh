/** Chuẩn hóa câu trả lời: thường, bỏ dấu tiếng Việt, đ→d, ký tự lạ → khoảng trắng. */
export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** So khớp tên: bỏ hết khoảng trắng. */
export function sameName(a: string, b: string) {
  return normalizeAnswer(a).replace(/ /g, '') === normalizeAnswer(b).replace(/ /g, '');
}

/** Câu trả lời chứa một trong các cụm từ khóa (theo ranh giới từ). */
export function containsKeyword(input: string, keywords: string[]) {
  const n = ` ${normalizeAnswer(input)} `;
  const compact = n.replace(/ /g, '');
  const words = n.trim().split(' ');
  return keywords.some((k) => {
    // "$xxx" = từ CUỐI của câu trả lời phải là xxx (vd. "họ Hồ" đúng, "họ Trương" sai)
    if (k.startsWith('$')) return words[words.length - 1] === normalizeAnswer(k.slice(1));
    const kn = normalizeAnswer(k);
    if (!kn) return false;
    return n.includes(` ${kn} `) || (kn.length >= 6 && compact.includes(kn.replace(/ /g, '')));
  });
}
