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

## Công nghệ

- HTML, CSS, JavaScript
- TensorFlow.js + MobileNet (nhận diện ảnh)
- Lưu tiến trình: localStorage (offline) + **Supabase** (Auth + Database) khi đăng nhập
- Thư mục `server/`: API tự host (tùy chọn, không dùng khi dùng Supabase)
- AI server (tùy chọn): Python FastAPI + YOLO, deploy Render, web gọi qua HTTPS
