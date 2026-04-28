# Báo cáo Tổng hợp Dự án: "Hòm thư góp ý trực tuyến"
*Trung đoàn BB4 – Sư đoàn BB5 | Ngày khảo sát: 28/04/2026*

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

### Frontend
| Hạng mục | Chi tiết |
|---|---|
| Kiến trúc trang | Multi-page với React Router: `/`, `/truyen-thong`, `/faq`, `/admin`, `/admin/gop-y` |
| Layout phân tách | `ClientLayout` (Header + Footer) và `AdminLayout` (Sidebar + Header) riêng biệt |
| Trang Góp ý | Form gửi (Ẩn danh / Công khai), chọn cán bộ xử lý, tra cứu bằng mã GY-XXXXXX |
| Trang Truyền thống | Hiển thị thông tin lịch sử, anh hùng cá nhân/tập thể, link phim tài liệu |
| Trang FAQ | Accordion hỏi đáp, dùng dữ liệu từ `faqData.js` |
| Trang Admin | Dashboard thống kê (Tổng/Đã xử lý/Chờ) + Bảng danh sách góp ý |
| Biến môi trường | `.env.development` → `localhost:8080`, `.env.production` → `https://trungdoan4.io.vn` |
| CI/CD | GitHub Actions (`deploy.yml`) tự động build và deploy lên GitHub Pages |
| Tích hợp API | `FeedbackListPage.jsx` và `FeedbackPage.jsx` đã dùng `import.meta.env.VITE_API_BASE_URL` |

### Backend
| Hạng mục | Chi tiết |
|---|---|
| REST API | `POST /suggestions`, `GET /suggestions`, `GET /suggestions/lookup/{code}`, `PUT /suggestions/{id}/reply`, `DELETE /suggestions/{id}` |
| Entity | `Suggestion` có đầy đủ: body, suggestedBy, handledBy, response, status, trackingCode, soft delete |
| Service Layer | Đầy đủ logic: tạo mã định dạng ngày tháng, lọc soft delete, sắp xếp mới nhất lên đầu |
| CORS | Đã mở `allowedOrigins("*")` để Frontend từ GitHub Pages gọi được |
| Spring Profiles | `application-dev.properties` (local) / `application-prod.properties` (VPS) |
| Systemd Service | `todoapp.service` giúp app chạy ngầm 24/7 và tự khởi động khi VPS reboot |
| Nginx | Đã cài đặt, cấu hình Reverse Proxy chuyển cổng 80 → 8080 |

---

## III. Những việc còn dở dang ⚠️

### 🔴 Ưu tiên Cao (Đã xử lý hoàn tất)
*Ghi chú: Toàn bộ các vấn đề chặn Production dưới đây đã được chúng ta giải quyết triệt để sau khi báo cáo này được lập.*
- [x] Kích hoạt HTTPS bằng Certbot
- [x] Cấu hình Nginx proxy và sửa lỗi xung đột Iptables
- [x] Thay thế URL cứng trong Dashboard bằng biến môi trường
- [x] Triển khai luồng Release Branching qua Github Actions
- [x] Tối ưu hóa Tracking Code (Định dạng ngày tháng + Ký tự: 280426A) và copy tự động ở Frontend.

### 🟡 Ưu tiên Trung bình (Nên làm tiếp theo)

**1. Không có cơ chế xác thực Admin**
- Trang `/admin` và `/admin/gop-y` không có trang đăng nhập, không có bảo vệ bằng mật khẩu.
- Bất kỳ ai biết đường dẫn đều có thể truy cập, xóa, phản hồi góp ý.
- **Giải pháp đề xuất:** Thêm trang Login đơn giản với mật khẩu cứng hoặc tích hợp Spring Security.

**2. Admin Dashboard thiếu tính năng lọc/tìm kiếm**
- Hiện tại chỉ hiển thị toàn bộ danh sách theo thứ tự mới nhất lên đầu.
- Không có chức năng lọc theo trạng thái (PENDING / RESOLVED), tìm kiếm theo tên người gửi.

---

### 🟢 Ưu tiên Thấp (Cải thiện về sau)

**3. Backend chưa có Pagination (Phân trang)**
- API `GET /suggestions` trả về toàn bộ danh sách.
- Khi số lượng góp ý lớn, hiệu năng sẽ giảm rõ rệt.

**4. Không có thông báo Email / Realtime**
- Khi admin phản hồi, người gửi không được thông báo.
- Người dùng phải chủ động vào tra cứu mã để biết kết quả.

**5. Chưa có log quản lý hành động Admin**
- Không ghi lại ai đã phản hồi góp ý nào, vào lúc nào.

---

## IV. Thông tin kỹ thuật cần lưu ý

| Thông số | Giá trị |
|---|---|
| VPS IP | `160.187.229.25` |
| VPS User | `root` |
| VPS DB User | `admin` |
| DB Name | `db_homthugopy` |
| Tên miền | `trungdoan4.io.vn` |
| Backend Port | `8080` |
| Frontend GitHub | `QLam130902/trungdoan4.online` |
| Backend Service | `todoapp` (systemd) |
| Lệnh kiểm tra sống | `curl localhost:8080/suggestions` (trên SSH) |
| Lệnh xem log | `journalctl -u todoapp -f` (trên SSH) |
