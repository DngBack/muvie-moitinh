# Mối Tình Đẫm Máu — Thiên Hy Niên 2.0

Web app đồng hành cho kịch bản 《Mối Tình Đẫm Máu》, thay thế “ứng dụng nhỏ” trong Sổ tay người dẫn trò:

- **Người chơi** (điện thoại): quét QR → nhập mã khóa lời mời → phòng chat OICQ “Tinh Anh Thiên Hy” → xác minh mật khẩu nhật ký → Lượt chơi thứ ba (Giao diện 1–6, câu hỏi bảo mật, Chương cuối) → màn Kết cục lưu được ảnh.
- **Người dẫn trò (DM)**: Điều khiển giai đoạn (Mở / Chờ mở / Đã mở, cảnh báo “chưa hoàn thành”), **Kịch bản dẫn từng bước**, **Âm thanh & video** (20 cue theo sổ tay), **Tra cứu** đáp án/manh mối, **Lượt chơi** (theo dõi 6 người, giải phóng thiết bị, mở khóa khi kẹt, in mã QR, đóng phòng).

Công nghệ: Next.js 14 (App Router) · Supabase (Postgres + Realtime + Storage + Auth) · triển khai trên Vercel.

---

## 1. Dựng Supabase (một lần)

1. Tạo project tại <https://supabase.com>.
2. **SQL Editor** → dán toàn bộ `supabase/migrations/0001_init.sql` → **Run**.
3. **Authentication → Sign In / Providers**:
   - Bật **Allow anonymous sign-ins** (người chơi đăng nhập ẩn danh, không cần tài khoản).
   - Giữ **Email** provider bật.
4. Tạo tài khoản DM: **Authentication → Users → Add user** (email + mật khẩu, tick *Auto Confirm User*).
5. Cấp quyền DM cho email đó (SQL Editor):
   ```sql
   insert into public.dm_accounts(email) values ('dm@quan-cua-ban.vn');
   ```
   Mỗi DM mới: lặp lại bước 4–5. Chỉ email trong `dm_accounts` mới tạo phòng / tải file được.
6. **Project Settings → API**: chép `Project URL` và `anon public key`.

> Realtime và bucket `media` đã được migration bật sẵn.

## 2. Deploy lên Vercel

1. Đẩy repo này lên GitHub → Vercel **Add New Project** → chọn repo (Framework: Next.js, mặc định).
2. **Environment Variables**:
   | Tên | Giá trị |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
3. Deploy. Lấy tên miền (vd. `https://moitinh.vercel.app`).

Chạy thử trên máy: cài Node 20, `cp .env.example .env.local` (điền 2 biến), `npm install`, `npm run dev`.

## 3. Chuẩn bị trước buổi chơi

- **In mã QR** (`/dm/qr`): 6 mã nhân vật (dán trang đầu mỗi kịch bản, trỏ về `/p/1`…`/p/6`) + 1 mã “Thư của Hoan Hoan” (trỏ về `/p`). Mã cố định theo tên miền — in một lần, dùng mãi. Đổi tên miền thì in lại.
- **Âm thanh & video** (tab Âm thanh → tick “Hiện nút tải file”): tải file cho các cue 01–20 và video *Tin tức Giang Thành*. Cue giọng nói chưa có file (01, 07, 15, 17, 18, 19) vẫn dùng được: app hiện văn bản để DM đọc hoặc **đọc bằng giọng máy** tiếng Việt.
- **Ảnh nền** (tùy chọn): app đã có hình vẽ mô phỏng phong cách gốc; có thể thay bằng ảnh thật ở mục “Ảnh nền cảnh”.
- **Xem trước** mọi màn hình người chơi: `/dm/preview` (không ghi gì lên server — dùng để diễn tập).

## 4. Trong buổi chơi

1. DM đăng nhập `/dm` → **Tạo** lượt chơi → app sinh **mã khóa lời mời 8 số** (hiện trên đầu trang, có thể viết lên bảng).
2. Người chơi quét QR trang đầu kịch bản → nhập mã → **Vào**. Đủ 6 người → phòng chat tự mở.
3. Theo tab **Kịch bản**: mỗi bước có lời thoại (gạch chân), hành động (nền vàng), lưu ý (nền đỏ), nút phát nhạc (chữ đỏ) và nút **Mở** giao diện ngay tại chỗ — giống ký hiệu trong sổ tay. Bước hiện tại được lưu trên server.
4. Lượt chơi thứ ba: người chơi quét QR trong “Thư của Hoan Hoan” → tự quay về đúng vai. DM bấm **Mở** từng giao diện; nếu còn người chưa xong, app hỏi “【…】 vẫn chưa hoàn thành, có tiếp tục không?”.
5. Cuối: mục **Kết cục** → *Tắt trò chơi* / *Tiếp tục trò chơi* → điện thoại người chơi hiện màn kết cục, sửa dòng chữ kỷ niệm và bấm **Lưu**.
6. Xong: tab **Lượt chơi** → **Đóng phòng** (mã khóa hết hiệu lực).

### Thoát ra / vào lại (không mất tiến độ)

- **Người chơi**: thoát trình duyệt, khóa màn hình, mất mạng… mở lại link/QR là về đúng màn đang dở (cả dòng thoại đang đọc). Đổi điện thoại hoặc xóa dữ liệu trình duyệt: quét lại QR + nhập lại mã khóa → lấy lại vai, tiến độ vẫn nằm trên server.
- **DM**: phiên đăng nhập được nhớ; mở `/dm` → **Tiếp tục** lượt chơi đang mở. Mọi trạng thái (giai đoạn, bước kịch bản, kết cục) lưu trên server. Màn hình DM được giữ sáng khi đang dẫn.
- Người chơi kẹt (quên mật khẩu, hỏng máy giữa câu hỏi bảo mật…): tab **Lượt chơi** → *Mở khóa: …* hoặc *Giải phóng thiết bị*.

### Gợi ý nhẹ trong app

- Nhập tên sai ≥ 2 lần: gợi ý chia sẻ phòng chat / tìm lý do. DM thấy số lần sai của từng người.
- Giao diện 2: nhập lại tên cũ → nhắc đọc câu “Ai có hoàn cảnh giống tôi…”.
- Giao diện 4–5: ô đáp án có gợi ý tăng dần sau mỗi lần sai.
- Đáp án được chấm trên server (`/api/check`), chấp nhận gõ không dấu.

## 5. Sửa nội dung

Toàn bộ nội dung nằm trong `src/content/` — sửa chữ không cần đụng code giao diện:

| File | Nội dung |
|---|---|
| `characters.ts` | 6 nhân vật, thân phận lớp 1/lớp 2, màu nhãn |
| `chatLogs.ts` | Log phòng chat từng người (các câu `// MANH MỐI` là câu sổ tay dùng để suy luận — giữ nguyên ý) |
| `interfaces.ts` | Lời thoại Giao diện 1–6, Chương cuối, câu hỏi + gợi ý GD4/GD5 |
| `security.ts` | Câu hỏi bảo mật & gợi ý |
| `endings.ts` | Văn bản 2 kết cục |
| `audioCues.ts` | Danh sách 20 cue + văn bản giọng đọc |
| `dmScript.ts` | Kịch bản dẫn từng bước |
| `lookup.ts` | Bảng tra cứu |
| `src/server/answers.ts` | **Đáp án** (chỉ chạy trên server) |

Lưu ý: log phòng chat và lời thoại các giao diện được **tái dựng** từ sổ tay (bản gốc của mini program không có trong tài liệu dịch); ảnh nền là hình vẽ mô phỏng. Có tư liệu gốc thì thay vào các file trên / tải ảnh lên slot tương ứng.
