# Báo cáo Tổng hợp Dự án: "Hòm thư góp ý trực tuyến"
*Sư đoàn BB5 - Quân khu 7 | Cập nhật: 05/05/2026*

---

## I. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────┐
│                      NGƯỜI DÙNG                          │
└──────────┬───────────────────────────┬───────────────────┘
           │                           │
    [Client/Bộ đội]              [Admin/Quản lý]
           │                           │
┌──────────▼───────────────────────────▼───────────────────┐
│     FRONTEND: React + Vite                                │
│     URL: https://sudoan5.io.vn (GitHub Pages)             │
│   • HashRouter (phù hợp với static host)                  │
│   • 3 trang Client: FeedbackPage, TraditionPage, FAQPage  │
│   • 2 trang Admin:  DashboardPage, FeedbackListPage       │
│   • Floating Contact Menu: Zalo, Messenger, Gọi điện      │
│   • CI/CD: GitHub Actions tự động build khi push          │
└──────────────────────────┬───────────────────────────────┘
                           │ REST API (HTTPS)
┌──────────────────────────▼───────────────────────────────┐
│     BACKEND: Spring Boot 3.4                              │
│     URL: https://api.sudoan5.io.vn (VPS Ubuntu 22.04)     │
│   • Systemd Service: todoapp.service                      │
│   • Nginx Reverse Proxy (443 → 8080)                      │
│   • SSL: Let's Encrypt (tự gia hạn)                       │
│   • MySQL 8 Database: db_homthugopy                       │
└──────────────────────────────────────────────────────────┘
```

---

## II. Những gì đã hoàn thành ✅

### Hệ thống Đăng nhập & Phân quyền
| Hạng mục | Chi tiết |
|---|---|
| Xác thực JWT | Backend sử dụng Spring Security + JWT. Token có thời hạn, bảo mật cao. |
| Phân quyền Role-based | Chia 2 cấp độ: `ROLE_ADMIN` (Toàn quyền) và `ROLE_OFFICER` (Chỉ xử lý góp ý). |
| Quản lý Cán bộ | Admin có trang riêng để tạo/xóa tài khoản cán bộ trong Modal. |
| Protected Route | Frontend tự động chặn truy cập trái phép, đá về trang Login nếu chưa xác thực. |

### Tối ưu giao diện (UX/UI)
| Hạng mục | Chi tiết |
|---|---|
| Nâng cấp quy mô | Toàn bộ giao diện đã được chuyển từ Trung đoàn 4 → **Sư đoàn 5 - Quân khu 7** |
| Floating Contact Menu | Nút FAB hình cánh quạt góc dưới phải: Gọi điện, Zalo, Messenger, Thư ngỏ |
| Trang Truyền thống | Lịch sử Sư đoàn 5, thống kê Anh hùng, trận đánh tiêu biểu, series phim tài liệu |
| Responsive | Layout Card (Mobile) / Table (Desktop) tối ưu ở breakpoint 768px |
| Bộ lọc trạng thái | Thanh Tab Filter (Tất cả / Chưa xử lý / Đã xử lý) |
| SĐT Liên hệ | Để lại SĐT, Admin có thể Copy hoặc Gọi trực tiếp từ trang quản trị |

### Quản trị & Phân tích Dữ liệu
| Hạng mục | Chi tiết |
|---|---|
| Phân trang | Phân trang từ Backend (10/25/50 items), kết hợp với bộ lọc |
| Dashboard & Biểu đồ | Chart.js (Cột & Tròn), thống kê thực tế, responsive |
| Xuất Báo cáo Excel | ExcelJS — chuẩn quân đội (Times New Roman 14, viền bảng) |
| Quản lý Phiên | `authFetch` bắt lỗi 401, Modal cảnh báo hết hạn, tự chuyển về Login |

### Hạ tầng & Deploy
| Hạng mục | Chi tiết |
|---|---|
| Tên miền | `sudoan5.io.vn` (Frontend) + `api.sudoan5.io.vn` (Backend) |
| HTTPS | SSL Let's Encrypt cả 2 domain, tự gia hạn |
| CI/CD | GitHub Actions tự động build và deploy khi push vào `deploy/*` |

---

## III. Những việc còn lại & Định hướng

### 🟡 Ưu tiên Trung bình
- [ ] **Thông báo Realtime**: Gửi thông báo cho Admin khi có góp ý mới qua Telegram Bot hoặc Email.
- [ ] **Tìm kiếm / Lọc nâng cao**: Ô tìm kiếm theo tên người gửi, mã tra cứu trong trang Admin.

### 🟢 Ưu tiên Thấp
- [ ] **Nhật ký hệ thống (Audit Log)**: Ghi lại lịch sử ai đã phản hồi góp ý nào.
- [ ] **Đổi mật khẩu**: Trang cá nhân cho cán bộ tự đổi mật khẩu định kỳ.

---

## IV. Quy mô và Luồng dự án

### 1. Luồng dữ liệu chính
1. **Gửi góp ý**: Người dùng (Bộ đội/Thân nhân) → Form Client → Backend lưu DB → Trả về mã Tra cứu.
2. **Xử lý**: Admin/Cán bộ đăng nhập → Xem danh sách → Phản hồi → Status chuyển sang RESOLVED.
3. **Tra cứu**: Người dùng nhập mã → Hệ thống hiển thị nội dung phản hồi (nếu có).

---

## V. Thông tin kỹ thuật cần lưu ý

| Thông số | Giá trị |
|---|---|
| VPS IP | `160.187.229.25` |
| SSH | `ssh root@160.187.229.25` |
| Tên miền chính | `https://sudoan5.io.vn` |
| Tên miền API | `https://api.sudoan5.io.vn` |
| Trang quản trị | `https://sudoan5.io.vn/#/admin/login` |
| Tài khoản Admin | `admin` / `aATrungdoan4aA@` |
| Tài khoản Cán bộ | `tuannvt` / `Trungdoan4@2026` |
| DB Name | `db_homthugopy` / User: `admin` |
| Backend Service | `todoapp` (systemd) |
| Repo Frontend | `github.com/QLam130902/trungdoan4.online` |
| Repo Backend | `github.com/QLam130902/trungdoan4.server` |
