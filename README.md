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
- **Có đăng nhập để lưu tiến trình lên server:**
  1. Chạy API: `cd server` → `npm install` → `npm start` (mặc định http://localhost:3001).
  2. Chạy game: từ thư mục gốc `npx serve .` (hoặc port khác), mở http://localhost:3000.
  3. Trong game bấm **Đăng nhập** → chọn **Đăng ký** (tạo tài khoản) hoặc **Đăng nhập** (email + mật khẩu). Sau khi đăng nhập, tiến trình tự lưu lên server và khi vào lại (cùng tài khoản) sẽ tải bản đã lưu.

## Công nghệ

- HTML, CSS, JavaScript
- TensorFlow.js + MobileNet (nhận diện ảnh)
- Lưu tiến trình: localStorage (offline) + API server (khi đăng nhập)
- Server: Node.js, Express, JWT, bcrypt; dữ liệu lưu trong `server/data/`
