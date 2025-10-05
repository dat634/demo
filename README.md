# 🎮 DOL English - Hệ Thống Học Online Vừa Học Vừa Chơi

## 📋 Tổng Quan
Hệ thống học tiếng Anh online với **8 minigame thú vị**, tập trung vào từ vựng và game, được thiết kế theo phong cách DOL English với tone màu đỏ, cam, xanh dương.

## 🎯 Tính Năng Chính

### 🏠 Trang Chủ (main-page.html)
- Giao diện chính của DOL English
- Navigation với link đến trang học online
- Section giới thiệu về minigame học tập
- Thiết kế responsive với gradient màu đỏ-cam-xanh

### 🎮 Trang Học Online (learning-hub.html)
- **8 Minigame đa dạng:**
  1. **🃏 Flashcard Quiz** - Học từ vựng với thẻ ghi nhớ
  2. **❓ Multiple Choice** - Chọn đáp án đúng từ 4 lựa chọn
  3. **⌨️ Typing Challenge** - Luyện tập chính tả và tốc độ gõ
  4. **⚡ Speed Mode** - 30 giây thử thách tốc độ
  5. **🎯 Word Shooter** - Bắn từ tiếng Anh đang rơi xuống
  6. **🧩 Word Puzzle** - Ghép chữ cái tạo từ tiếng Anh
  7. **🎲 Memory Match** - Lật thẻ tìm cặp từ vựng
  8. **🎪 Word Circus** - Điều khiển chú hề bắt từ vựng

### 📊 Hệ Thống Điểm Số
- Điểm tổng tích lũy
- Điểm cao nhất cho từng game
- Số lượt chơi
- Ngày học liên tiếp (streak)
- Bảng xếp hạng

### 📚 Hệ Thống Từ Vựng Nâng Cao
- **200+ từ vựng** được phân loại theo 3 cấp độ (Cơ bản, Trung bình, Nâng cao)
- **12 chủ đề** đa dạng: Gia đình, Động vật, Màu sắc, Thức ăn, Cảm xúc, Thời tiết, Trường học, Du lịch, Kinh doanh, Công nghệ, Khoa học, Văn học
- **Phát âm IPA** và ví dụ câu cho mỗi từ
- **Hệ thống yêu thích** - lưu từ vựng quan trọng
- **Thống kê tiến độ** - theo dõi độ chính xác và số lần học
- **Tìm kiếm thông minh** - tìm theo từ tiếng Anh hoặc tiếng Việt
- **Lọc theo cấp độ và chủ đề**
- **Chế độ ôn tập** - học lại từ có độ chính xác thấp

## 🎨 Thiết Kế

### Màu Sắc Chính
- **Đỏ:** `#e74c3c` - Màu chủ đạo DOL
- **Cam:** `#f39c12` - Màu accent
- **Xanh dương:** `#3498db` - Màu phụ
- **Xanh đậm:** `#2c3e50` - Màu text
- **Trắng:** `#ffffff` - Background
- **Xám nhạt:** `#f8f9fa` - Background phụ

### Giao Diện
- **Modern & Clean:** Thiết kế hiện đại, sạch sẽ
- **Gradient Backgrounds:** Sử dụng gradient đỏ-cam-xanh
- **Card-based Layout:** Layout dạng thẻ cho các game
- **Responsive:** Tương thích mọi thiết bị
- **Animations:** Hiệu ứng hover, float, bounce

## 🚀 Cách Sử Dụng

### 1. Mở Trang Web
```bash
# Mở file main-page.html trong trình duyệt
open html/main-page.html
```

### 2. Truy Cập Học Online
- Click vào "🎮 Học Online" trên navigation
- Hoặc click "Bắt đầu học ngay!" trong section giới thiệu

### 3. Chọn Minigame
- **Dễ:** Flashcard Quiz
- **Trung bình:** Multiple Choice, Typing Challenge
- **Khó:** Speed Mode
- **Chuyên gia:** Word Shooter

### 4. Chơi Game
- Mỗi game có 10 câu hỏi (trừ Speed Mode: 30 giây)
- Điểm số được tính theo độ khó
- Kết quả được lưu tự động

## 📁 Cấu Trúc File

```
Myproject/
├── html/
│   ├── main-page.html          # Trang chủ
│   ├── learning-hub.html       # Trang học online với minigames
│   ├── vocabulary-manager.html # Trang quản lý từ vựng
│   ├── login.html              # Trang đăng nhập
│   └── register.html           # Trang đăng ký
├── css/
│   ├── main-page.css           # CSS trang chủ
│   ├── learning-hub.css        # CSS học online
│   ├── vocabulary-manager.css  # CSS quản lý từ vựng
│   ├── login.css               # CSS đăng nhập
│   └── register.css            # CSS đăng ký
├── js/
│   ├── main-page.js            # JS trang chủ
│   ├── learning-hub.js         # JS học online
│   ├── vocabulary-database.js  # Database từ vựng
│   ├── vocabulary-manager.js   # JS quản lý từ vựng
│   ├── login.js                # JS đăng nhập
│   └── register.js             # JS đăng ký
└── material/                   # Hình ảnh
```

## 🎮 Chi Tiết Minigame

### 🃏 Flashcard Quiz
- **Cách chơi:** Xem từ tiếng Anh → Nhấn "Show Answer" → Đánh giá khả năng nhớ
- **Điểm:** +10 nếu đúng
- **Ưu điểm:** Dễ code, trực quan
- **Mục tiêu:** Luyện trí nhớ từ vựng

### ❓ Multiple Choice
- **Cách chơi:** Chọn đáp án đúng từ 4 lựa chọn
- **Điểm:** +10 nếu đúng, -5 nếu sai
- **Ưu điểm:** Vui nhộn, dễ mở rộng
- **Mục tiêu:** Kiểm tra hiểu biết

### ⌨️ Typing Challenge
- **Cách chơi:** Gõ từ tiếng Anh theo nghĩa tiếng Việt
- **Điểm:** +15 nếu đúng, -3 nếu sai
- **Ưu điểm:** Luyện chính tả
- **Mục tiêu:** Cải thiện kỹ năng gõ và chính tả

### ⚡ Speed Mode
- **Cách chơi:** 30 giây trả lời nhiều câu hỏi nhất
- **Điểm:** +20 nếu đúng, -10 nếu sai
- **Ưu điểm:** Tạo hồi hộp, dễ nghiện
- **Mục tiêu:** Luyện phản xạ nhanh

### 🎯 Word Shooter
- **Cách chơi:** Bắn từ tiếng Anh đang rơi xuống
- **Điểm:** +25 nếu bắn trúng, -5 nếu bắn sai
- **Ưu điểm:** Thú vị như game nhỏ
- **Mục tiêu:** Luyện phản xạ và từ vựng

## 💾 Lưu Trữ Dữ Liệu
- Sử dụng **localStorage** để lưu:
  - Điểm số tổng
  - Điểm cao nhất từng game
  - Số lượt chơi
  - Ngày học liên tiếp
  - Bảng xếp hạng

## 🔧 Tùy Chỉnh

### Thêm Từ Vựng Mới
```javascript
// Trong file learning-hub.js
this.vocabulary = [
    { english: "new_word", vietnamese: "từ mới" },
    // ... thêm từ khác
];
```

### Thay Đổi Màu Sắc
```css
/* Trong file CSS */
:root {
    --dol-red: #your-color;
    --dol-orange: #your-color;
    --dol-blue: #your-color;
}
```

### Thêm Minigame Mới
1. Thêm card game trong `learning-hub.html`
2. Implement logic trong `learning-hub.js`
3. Thêm CSS styling trong `learning-hub.css`

## 🌟 Tính Năng Nổi Bật

- ✅ **Responsive Design** - Hoạt động tốt trên mọi thiết bị
- ✅ **Local Storage** - Lưu tiến độ học tập
- ✅ **Real-time Scoring** - Điểm số cập nhật ngay lập tức
- ✅ **Smooth Animations** - Hiệu ứng mượt mà
- ✅ **Gamification** - Tạo động lực học tập
- ✅ **Multiple Difficulty** - Nhiều cấp độ khó
- ✅ **Leaderboard** - Bảng xếp hạng cạnh tranh

## 🎯 Mục Tiêu Học Tập

Hệ thống được thiết kế để:
- **Tăng hứng thú** học tiếng Anh
- **Cải thiện từ vựng** thông qua game
- **Luyện phản xạ** nhanh với ngôn ngữ
- **Tạo thói quen** học tập hàng ngày
- **Theo dõi tiến độ** học tập

## 🚀 Phát Triển Tương Lai

- [ ] Thêm nhiều từ vựng hơn
- [ ] Tích hợp API từ điển
- [ ] Thêm minigame mới
- [ ] Hệ thống thành tích (achievements)
- [ ] Chia sẻ kết quả lên mạng xã hội
- [ ] Chế độ multiplayer
- [ ] Tích hợp AI để cá nhân hóa

---

**🎮 Chúc bạn học tiếng Anh vui vẻ với DOL English!**
