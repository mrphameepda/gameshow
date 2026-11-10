# BỘ QUY CHUẨN PHÁT TRIỂN GAME SHOW CÔNG GIÁO (BẮT BUỘC TUÂN THỦ)

Mỗi khi người dùng cung cấp một file mã nguồn HTML của một trò chơi mới, AI Agent PHẢI TỰ ĐỘNG THỰC HIỆN TUẦN TỰ 4 BƯỚC SAU MÀ KHÔNG CẦN NHẮC LẠI:

### ĐIỀU 1: TỰ ĐỘNG BÓC TÁCH & TẢI TÀI NGUYÊN (ASSET CRAWLER)
1. **Hình ảnh & Logo:**
   - Quét toàn bộ link ảnh trong file HTML (thẻ `<img>`, `style="background-image..."`, icon).
   - Tự động chạy lệnh curl/fetch tải về thư mục: `public/images/[game-id]/`.
   - Nếu có ảnh logo chính của game, đặt tên là `public/images/[game-id]/thumbnail.png` để tự động làm ảnh đại diện trên Trang Chủ.
2. **Âm thanh (Audio):**
   - Quét toàn bộ link âm thanh trong thẻ `<audio>` hoặc Javascript.
   - Tự động tải về thư mục: `public/sounds/[game-id]/`.
   - Thay thế toàn bộ link `http://...` cũ thành đường dẫn cục bộ `/sounds/[game-id]/[ten-file].mp3`.

### ĐIỀU 2: NGUYÊN TẮC BẢO TỒN DỮ LIỆU & THUẬT NGỮ (BẤT KHẢ XÂM PHẠM)
1. **Bảo tồn câu hỏi:** Giữ nguyên văn 100% nội dung câu hỏi (`q`), các đáp án (`o`), đáp án đúng. Tuyệt đối không tự ý viết lại, không tóm tắt, không biên tập lại từ ngữ Thần học, Kinh Thánh, Phụng vụ, Tên Thánh.
2. **Trích xuất dữ liệu:** Tự động tách mảng câu hỏi ra file riêng tại `src/data/questions/[game-id]/default-set.ts`.
3. **Thông tin tác quyền:** Giữ nguyên 100% thông tin tác giả: "Giuse Phạm Duy Ái, SDS", email: mrphamee@gmail.com, và Facebook/Tiktok trong modal thông tin.

### ĐIỀU 3: TỰ ĐỘNG ĐỒNG BỘ VÀO TRANG CHỦ (HOMEPAGE AUTO-SYNC)
1. Hệ thống danh sách game được quản lý tập trung tại `src/config/gamesList.ts`.
2. Khi một game mới được import:
   - Tự động đổi trạng thái game đó từ `coming_soon` sang `ready`.
   - Tự động liên kết đường dẫn thumbnail tới `public/images/[game-id]/thumbnail.png`.
   - Gán router chuyển hướng vào đúng `/games/[game-id]`.
3. **Quy chuẩn giao diện Trang Chủ:**
   - Banner màu sắc tươi sáng dành cho thiếu nhi: "CÔNG GIÁO GAME SHOWS - VUI HỌC CÙNG THẦY GIÊSU".
   - Thanh tìm kiếm và bộ lọc Tabs danh mục (Tất cả, Trí tuệ, Kinh Thánh, Sinh hoạt, Xổ số).
   - Card game hiển thị dạng Icon App vuông bo góc tròn (`rounded-3xl`), tỷ lệ chuẩn, có nhãn HOT đỏ.
   - Footer chuẩn thông tin liên hệ của tác giả.

### ĐIỀU 4: BẢO TOÀN TÍNH NĂNG KỸ THUẬT CỦA GAME
- Giữ đầy đủ tất cả nút bấm, quy trình chơi, đồng hồ đếm ngược đổi màu, chế độ phóng to máy chiếu (Projector Fullscreen), và pháo hoa chiến thắng.
- Tự động lưu và phục hồi ván đấu qua `localStorage` theo prefix `[game-id]_save_game`.
- Build TypeScript sạch 100% không phát sinh lỗi.

### ĐIỀU 5: QUY CHUẨN AN TOÀN DỮ LIỆU ĐẦU VÀO & BẢO VỆ GIAO DIỆN (UI DEFENSE & ANTI-SPAM)
1. **Giới hạn độ dài nhập liệu (Input Validation):**
   - Mọi ô input nhập Họ tên người chơi/thí sinh: BẮT BUỘC có `maxLength={25}`.
   - Mọi ô input nhập Giáo xứ / Giáo phận / Đội thi: BẮT BUỘC có `maxLength={30}`.
   - Trước khi lưu vào State, localStorage hoặc gửi lên Firebase/Database, phải luôn gọi hàm chuẩn hóa:
     `const cleanName = name.trim().slice(0, 25);`
   - Loại bỏ các ký tự HTML nguy hiểm để chống lỗi XSS.

2. **Chống vỡ khung hiển thị (Anti-Overflow Layout):**
   - Mọi vị trí render tên người chơi, giáo xứ, bảng xếp hạng (Leaderboard), thẻ thí sinh:
     + BẮT BUỘC có class chống tràn: `truncate` (hoặc `overflow-hidden text-ellipsis whitespace-nowrap block max-w-full min-w-0`).
     + Phần tử cha chứa danh sách text phải có thuộc tính `min-w-0` để Flexbox/Grid không bị phần tử con đẩy phình to chiều ngang.
   - Layout 2 cột (Khu vực chơi & Bảng xếp hạng) luôn dùng Grid tỷ lệ chuẩn (`md:grid-cols-12`, cột game chiếm 7-8 phần, cột bảng xếp hạng chiếm 4-5 phần), không dùng `flex-wrap` tự do khiến cột bị co dúm.

### ĐIỀU 6: BỘ QUY CHUẨN THIẾT KẾ GIAO DIỆN & NÚT BẤM (UNIFIED DESIGN SYSTEM)
1. **Bảng màu chủ đạo (Color Palette):**
   - Màu nền sân khấu thi đấu: Nền tối sang trọng (`bg-slate-950` hoặc `#0f172a`), chữ trắng và vàng kim để không bị chói mắt khi chiếu máy chiếu/LED.
   - Không được dùng 6-7 màu cầu vồng trên cùng một hàng nút bấm.
2. **Quy chuẩn nút bấm (Standard Buttons):**
   - Nút Hành động nổi bật nhất (Chiến thắng, Bắt đầu): `bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/30`.
   - Nút Điều khiển trận đấu (Chạy giờ, Đáp án, Phóng to): `bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700`.
   - Nút Loại thí sinh: `bg-rose-600 hover:bg-rose-500 text-white`.
   - Nút Vào sân: `bg-emerald-600 hover:bg-emerald-500 text-white`.
   - Hàng chọn gói câu hỏi (Dễ, Vừa, Khó, Cứu Trợ, Câu Phụ, Đố Vui): Tất cả dùng chung nền tối giản `bg-slate-800 text-slate-300`, chỉ gói nào ĐANG CHỌN thì mới nổi bật bằng `bg-amber-500 text-slate-950 font-bold`.

### ĐIỀU 7: QUY CHUẨN THIẾT KẾ APPLE LIQUID GLASS (WEB APPROXIMATION)
1. **NỘI DUNG LÀ NỀN TẢNG ĐỤC (OPAQUE CONTENT LAYER):**
   - Thẻ câu hỏi, thẻ phương án trả lời, thẻ thí sinh: TUYỆT ĐỐI KHÔNG LÀM KÍNH TRONG SUỐT. Phải dùng bề mặt đục (`bg-slate-900` hoặc `#0f172a`), viền dứt khoát, tương phản cao để chống lóa máy chiếu và bảo vệ mắt.
2. **KÍNH CHỈ DÀNH CHO LỚP ĐIỀU KHIỂN NỔI (FLOATING CONTROLS AS LIQUID GLASS):**
   - Chỉ áp dụng hiệu ứng kính cho:
     + Hàng thanh chọn gói câu hỏi (Floating Category Pills).
     + Thanh công cụ tác vụ (Floating Action Toolbar: Chạy giờ, Đáp án, Phóng to).
     + Thanh điều khiển thí sinh (Bottom Dock: Loại, Vào sân, Chiến thắng).
     + Nút nổi quản lý thí sinh trên mobile (Floating Capsule FAB).
3. **CÔNG THỨC CSS LIQUID GLASS CHUẨN:**
   - Hình khối viên thuốc (Capsule / `rounded-full`).
   - Khúc xạ ánh sáng viền:
     `backdrop-blur-2xl backdrop-saturate-150 bg-slate-900/60 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.25)]`
   - Trạng thái hover/active: Tăng độ khúc xạ và đổi ánh sáng viền (`hover:border-amber-400/50 hover:bg-slate-800/70`).

### ĐIỀU 8: ĐIỀU HƯỚNG VÀ TRẢI NGHIỆM LIÊN KẾT (NAVIGATION & LINKING)
- **Nút Về Sảnh Game (Trang Chủ):** TẤT CẢ các game đều PHẢI có một nút quay về sảnh chính (`/`) đặt ở góc trên bên trái hoặc phần Header của màn hình chơi.
- **Quy chuẩn hiển thị nút Sảnh Game:** Nút này được thiết kế theo dạng Glass Capsule bo tròn, ví dụ: `🏠 Sảnh Game`, sử dụng `react-router-dom` `<Link to="/">` với các class Liquid Glass để đảm bảo nhất quán giao diện.
