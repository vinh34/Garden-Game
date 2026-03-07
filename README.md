# 🌳 Vườn Trái Cây - Game Quét & Trồng

Game web: quét camera trái cây/cây → AI nhận diện → nhận hạt giống → trồng trong vườn → chăm sóc (tưới, bón phân) → thu hoạch → bán lấy tiền → mua nước, phân, lượt quét.

## Cách chơi

- **Lượt quét**: Ban đầu có 5 lượt. Vào tab **Quét**, bật camera, hướng vào trái cây hoặc cây thật (hoặc ảnh trên màn hình), bấm **Quét**. AI (MobileNet) sẽ nhận diện và tặng 1 hạt giống tương ứng.
- **Vườn**: Tab **Vườn** có lưới ô đất. Bấm ô trống → chọn hạt giống để trồng.
- **Chăm sóc**: Bấm ô đã trồng → **Tưới nước** (tốn 1 nước), **Bón phân** (tốn 1 phân). Cây cần đủ độ ẩm để lớn; tưới quá nhiều làm tăng **úng nước** — vượt 80% cây chết.
- **Mưa**: Khi trời mưa (đổi tự động), cây được cấp nước, không cần tưới (nhưng úng cũng tăng).
- **Thu hoạch**: Khi thanh "Lớn lên" đạt 100%, bấm **Thu hoạch**. Sản phẩm vào **Túi đồ**.
- **Bán**: Ở tab **Túi đồ**, bấm **Bán** từng sản phẩm để nhận tiền.
- **Cửa hàng**: Dùng tiền mua Nước, Phân bón, hoặc **Lượt quét** để tiếp tục quét camera.

## Chạy game

- Cần **HTTPS** hoặc **localhost** để trình duyệt cho phép camera.
- **Chỉ chơi (không đăng nhập):** mở bằng server tĩnh, ví dụ `npx serve .` rồi mở http://localhost:3000. Tiến trình lưu trên máy (localStorage).
- **Đăng nhập & lưu tiến trình bằng Supabase:**
  1. Tạo project tại [supabase.com](https://supabase.com) (miễn phí).
  2. Trong Dashboard → **SQL Editor**, chạy nội dung file `supabase-setup.sql` để tạo bảng `game_saves` và bật RLS.
  3. Trong **Project Settings → API** lấy **Project URL** và **anon public** key.
  4. Trong `index.html`, đặt cấu hình (trước khi load script):
     ```html
     <script>
       window.SUPABASE_URL = 'https://xxxxx.supabase.co';
       window.SUPABASE_ANON_KEY = 'eyJhbGc...';
     </script>
     ```
  5. Chạy game (ví dụ `npx serve .`), mở trang và bấm **Đăng nhập** → **Đăng ký** hoặc **Đăng nhập**. Tiến trình sẽ được lưu lên Supabase và tải lại khi đăng nhập.

- **AI Python (Render) để nhận diện chuẩn hơn khi deploy GitHub Pages:**
  1. Deploy thư mục `ai-server/` lên Render theo hướng dẫn `ai-server/render.md`.
  2. Lấy URL Render (ví dụ `https://your-ai.onrender.com`) và đặt trong `index.html`:
     ```html
     <script>
       window.AI_API_BASE = 'https://your-ai.onrender.com';
     </script>
     ```
  3. (Khuyến nghị) Set biến môi trường Render `ALLOWED_ORIGINS` = domain GitHub Pages của bạn để CORS chặt hơn.

## Công nghệ

- HTML, CSS, JavaScript
- TensorFlow.js + MobileNet (nhận diện ảnh)
- Lưu tiến trình: localStorage (offline) + **Supabase** (Auth + Database) khi đăng nhập
- Thư mục `server/`: API tự host (tùy chọn, không dùng khi dùng Supabase)
- AI server (tùy chọn): Python FastAPI + YOLO, deploy Render, web gọi qua HTTPS
