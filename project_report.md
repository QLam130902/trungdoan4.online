# Báo cáo Tổng hợp Dự án: "Hòm thư góp ý trực tuyến"
*Trung đoàn BB4 – Sư đoàn BB5 | Cập nhật: 01/05/2026*

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
│          FRONTEND: React + Vite (GitHub Pages)            │
│   • HashRouter (phù hợp với static host)                  │
│   • 3 trang Client: FeedbackPage, TraditionPage, FAQPage  │
│   • 2 trang Admin:  DashboardPage, FeedbackListPage       │
│   • Biến môi trường: .env.development / .env.production   │
└──────────────────────────┬───────────────────────────────┘
                           │ REST API (HTTP/HTTPS)
┌──────────────────────────▼───────────────────────────────┐
│          BACKEND: Spring Boot 3.4 (VPS Ubuntu 22.04)      │
│   • Systemd Service: todoapp.service                      │
│   • Nginx Reverse Proxy (cổng 80/443 → 8080)              │
│   • MySQL 8 Database: db_homthugopy                       │
│   • Spring Profiles: dev (Local) / prod (VPS)             │
└──────────────────────────────────────────────────────────┘
```

---

## II. Những gì đã hoàn thành ✅

### Hệ thống Đăng nhập & Phân quyền (Mới)
| Hạng mục | Chi tiết |
|---|---|
| Xác thực JWT | Backend sử dụng Spring Security + JWT. Token có thời hạn, bảo mật cao. |
| Phân quyền Role-based | Chia 2 cấp độ: `ROLE_ADMIN` (Toàn quyền) và `ROLE_OFFICER` (Chỉ xử lý góp ý). |
| Quản lý Cán bộ | Admin có trang riêng để tạo/xóa tài khoản cán bộ trong Modal. |
| Protected Route | Frontend tự động chặn truy cập trái phép, đá về trang Login nếu chưa xác thực. |
| Bảo mật | Ràng buộc không thể tự xóa tài khoản của chính mình. |

### Tối ưu giao diện (UX/UI)
| Hạng mục | Chi tiết |
|---|---|
| Responsive Triệt để | Layout Card List chuyên nghiệp trên Mobile, Table trên Desktop (Breakpoint 768px). |
| Card Mật độ cao | Giao diện mobile tối ưu với icon (`💬`, `👤`, `🕒`), hiển thị đầy đủ thông tin trên một màn hình. |
| Bộ lọc trạng thái | Thanh Tab Filter (Tất cả/Chưa xử lý/Đã xử lý) giúp quản lý công việc nhanh chóng. |
| Desktop Layout | Nới rộng 1200px, căn chỉnh cột hợp lý, nút thao tác không bị ngắt dòng. |
| Welcome Modal | Modal giới thiệu (localStorage) kèm nút bong bóng hỗ trợ người dùng mới hiểu về hệ thống. Nội dung cuộn được, nút đóng cố định. |
| FAQ Hướng dẫn | Nhóm câu hỏi tập trung vào hướng dẫn sử dụng và khẳng định tính chính thống của trang web. Phân loại theo Tab (Sinh hoạt, Nghỉ phép, Thân nhân...). |
| SĐT Liên hệ | Tính năng cho phép người dùng để lại SĐT và nhận thông báo cán bộ sẽ liên lạc lại ngay trong Modal thành công. |
| Auto-assign | Hệ thống tự động gán cán bộ mặc định (Trung tá Nguyễn Văn Tuấn) khi người dùng yêu cầu liên hệ lại. |
| Tải tài liệu | Tích hợp thư viện văn bản pháp quy (Thông tư 56/2025, 98/2025, Nghị định 27/2016...) cho phép tải về trực tiếp. |
| Đăng nhập ngầm | Lối tắt đăng nhập dành cho cán bộ được tích hợp tinh tế tại Logo Trung đoàn 4 trên Header. |

### Quản trị & Phân tích Dữ liệu (Mới hoàn thành)
| Hạng mục | Chi tiết |
|---|---|
| Phân trang (Pagination) | Phân trang trực tiếp từ Backend (10/25/50 items). Kết hợp mượt mà với bộ lọc trạng thái và thời gian. |
| Dashboard & Biểu đồ | Tích hợp Chart.js (Cột & Tròn). Hiển thị thống kê thực tế, tự động co giãn 100% cực nét trên Mobile và tối ưu không gian Desktop. |
| Xuất Báo cáo Excel | Tích hợp ExcelJS. Xuất file chuẩn quân đội (Times New Roman 14, in đậm header, viền bảng). Có Modal chọn thời gian (Tuần/Tháng/Quý/Tùy chọn). |
| Quản lý Phiên (Session) | Hàm `authFetch` bắt lỗi 401 toàn cục. Bật Modal cảnh báo hết hạn phiên (z-index cực đại), tự động dọn dẹp và chuyển hướng về Login qua HashRouter. |

### Các tính năng cốt lõi khác
| Hạng mục | Chi tiết |
|---|---|
| Trang Góp ý | Form gửi (Ẩn danh / Công khai), chọn cán bộ xử lý, tra cứu bằng mã GY-XXXXXX |
| CI/CD | GitHub Actions tự động build và deploy lên GitHub Pages |

---

## III. Những việc còn dở dang ⚠️

### 🟡 Ưu tiên Trung bình
- [ ] **Thông báo Realtime**: Gửi thông báo cho Admin khi có góp ý mới qua Telegram Bot hoặc Email.

### 🟢 Ưu tiên Thấp
- [ ] **Nhật ký hệ thống (Audit Log)**: Ghi lại lịch sử ai đã phản hồi góp ý nào để tăng tính minh bạch.
- [ ] **Đổi mật khẩu**: Trang cá nhân cho cán bộ tự đổi mật khẩu định kỳ.

---

## IV. Quy mô và Luồng dự án

### 1. Quy mô
Dự án được thiết kế cho quy mô cấp Trung đoàn (Regiment), phục vụ hàng nghìn cán bộ chiến sĩ và thân nhân. Hệ thống có khả năng mở rộng lên cấp Sư đoàn nhờ kiến trúc Microservices-ready và Database quan hệ chặt chẽ.

### 2. Luồng dữ liệu chính
1. **Gửi góp ý**: Người dùng (Bộ đội/Thân nhân) -> Form Client -> Backend lưu DB -> Trả về mã Tra cứu.
2. **Xử lý**: Admin/Cán bộ đăng nhập -> Xem danh sách (Lọc theo trạng thái) -> Phản hồi nội dung -> Status chuyển sang RESOLVED.
3. **Tra cứu**: Người dùng nhập mã -> Hệ thống hiển thị nội dung phản hồi của Cán bộ (nếu có).

---

## V. Thông tin kỹ thuật cần lưu ý

| Thông số | Giá trị |
|---|---|
| VPS IP | `160.187.229.25` |
| Tên miền | `https://trungdoan4.io.vn` |
| Tài khoản Admin | `admin` / `aATrungdoan4aA@` |
| Tài khoản Cán bộ | `tuannvt` / `Trungdoan4@2026` |
| Backend Service | `todoapp` (Spring Boot 3.4) |
| Frontend Host | GitHub Pages |
