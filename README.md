# Mối Tình Đẫm Máu — Thiên Hy Niên 2.0

Web app đồng hành cho kịch bản 《Mối Tình Đẫm Máu》, thay thế “ứng dụng nhỏ” trong Sổ tay người dẫn trò.

- **Người chơi** (điện thoại): quét QR → nhập mã khóa lời mời → phòng chat OICQ “Tinh Anh Thiên Hy” → mật khẩu nhật ký → Lượt chơi thứ ba (Giao diện 1–6, câu hỏi bảo mật, Chương cuối) → màn Kết cục lưu được ảnh.
- **Người dẫn trò (DM)**: tạo lượt chơi, Điều khiển giai đoạn (Mở / Chờ mở / Đã mở), Kịch bản dẫn từng bước, Tra cứu đáp án, theo dõi 6 người chơi.

**Không cần tài khoản.** DM bấm “Tạo” là có phòng; người chơi chỉ cần mã khóa. Mã có hiệu lực 12 giờ, dữ liệu tự xóa sau 2 ngày.

Công nghệ: Next.js 14 · Supabase (chỉ dùng database + realtime) · Vercel.

---

## 1. Dựng Supabase (5 phút, một lần)

1. Tạo project tại <https://supabase.com> (region gợi ý: Singapore).
2. **SQL Editor** → dán toàn bộ `supabase/migrations/0001_init.sql` → **Run**.
   (Chạy lại lúc nào cũng được — file tự xóa dữ liệu cũ và dựng lại.)
3. **Project Settings → API**: chép `Project URL` và khóa `anon public`.

Xong. Không cần bật Auth, không cần tạo user, không cần Storage.

## 2. Chạy trên máy

Cần Node 20.

```bash
cp .env.example .env.local     # điền 2 biến ở bước 1.3
npm install
npm run dev                     # http://localhost:3000
```

## 3. Deploy lên Vercel

1. Vercel → **Add New → Project** → import repo (Framework: Next.js).
2. **Environment Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. **Deploy**. (Thêm/sửa biến sau khi deploy → phải **Redeploy**.)

Bản Production lấy từ nhánh `main`.

## 4. Dẫn một buổi chơi

1. **Trước buổi** (một lần): mở `/dm/qr` → in 6 mã QR nhân vật (dán trang đầu kịch bản) + 1 mã “Thư của Hoan Hoan”. Mã QR cố định theo tên miền.
2. DM mở `/dm` → **Tạo** → nhận **mã khóa 8 số**, đọc/viết lên bảng cho người chơi.
3. Người chơi quét QR → nhập mã → **Vào**. Đủ 6 người → phòng chat tự mở.
4. Tab **Kịch bản** đi theo từng bước, có nút **Mở** giao diện ngay trong bước. Tab **Chủ trì** là bảng điều khiển giai đoạn; nếu còn người chưa xong, app hỏi “【…】 vẫn chưa hoàn thành, có tiếp tục không?”.
5. Cuối: **Kết cục** → *Tắt trò chơi* / *Tiếp tục trò chơi*.
6. Xong: tab **Lượt chơi** → **Đóng phòng**.

Nhạc/video: chưa có file trong app — DM phát từ thiết bị riêng; tab Kịch bản vẫn ghi rõ bài nào phát lúc nào. Các đoạn giọng đọc có nút “đọc bằng giọng máy”.

### Thoát ra / vào lại

- **Người chơi**: thoát trình duyệt, khóa màn hình, mất mạng… mở lại link/QR là về đúng chỗ. Đổi điện thoại: quét QR + nhập lại mã → lấy lại vai, tiến độ giữ nguyên (máy cũ tự bị đẩy ra).
- **DM**: máy đã tạo phòng tự nhớ phòng — mở `/dm` → **Tiếp tục**. Muốn điều khiển từ máy khác: tab **Lượt chơi** → **Link điều khiển** → mở link đó trên máy kia. Không gửi link này cho người chơi.
- Người chơi kẹt: tab **Lượt chơi** → *Mở khóa: …*, *Giải phóng thiết bị* hoặc *Xóa tiến độ*.

### Gợi ý nhẹ trong app

- Nhập tên sai ≥ 2 lần: gợi ý chia sẻ phòng chat. DM thấy số lần sai của từng người.
- Giao diện 2: nhập lại tên cũ → nhắc đọc câu “Ai có hoàn cảnh giống tôi…”.
- Giao diện 4–5: gợi ý tăng dần sau mỗi lần sai.
- Đáp án chấm trên server (`/api/check`), chấp nhận gõ không dấu.

## 5. Sửa nội dung

Nội dung nằm trong `src/content/` — sửa chữ không cần đụng giao diện:

| File | Nội dung |
|---|---|
| `characters.ts` | 6 nhân vật, thân phận lớp 1/lớp 2, màu nhãn |
| `chatLogs.ts` | Log phòng chat (các câu `// MANH MỐI` là câu dùng để suy luận — giữ nguyên ý) |
| `interfaces.ts` | Lời thoại Giao diện 1–6, Chương cuối, câu hỏi GD4/GD5 |
| `security.ts` | Câu hỏi bảo mật |
| `endings.ts` | Văn bản 2 kết cục |
| `audioCues.ts` | Danh sách 20 cue nhạc + văn bản giọng đọc |
| `dmScript.ts` | Kịch bản dẫn từng bước |
| `lookup.ts` | Bảng tra cứu |
| `src/server/answers.ts` | **Đáp án** (chỉ chạy trên server) |

Ảnh nền hiện là hình vẽ mô phỏng. Khi có file thật: sửa hàm `urlOf` trong `src/components/player/PlayerApp.tsx` (ảnh nền) và `AudioProvider urlOf` trong `src/components/dm/RoomConsole.tsx` (nhạc) để trả về URL file (ví dụ đặt file trong `public/`).

## 6. Cách app giữ quyền khi không có tài khoản

- Ai cũng **đọc** được trạng thái phòng (để realtime chạy) — chỉ là giai đoạn và tiến độ trò chơi.
- Mọi thao tác **ghi** đi qua hàm SQL và phải kèm khóa bí mật: DM nhận khóa khi tạo phòng, người chơi nhận khóa ghế khi nhập mã. Khóa lưu ở trình duyệt, nằm trong bảng mà trình duyệt không đọc được.
