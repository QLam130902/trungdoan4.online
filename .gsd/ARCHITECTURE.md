# Kiến trúc Hệ thống (System Architecture) - Nhánh Lưu trữ Sư đoàn 5 (`sudoan5`)

> Tự động tạo và cập nhật bởi lệnh `/map` vào ngày 14/09/2026

## Tổng quan (Overview)

Phiên bản này thuộc nhánh lưu trữ **`sudoan5`** của dự án "Hòm thư góp ý trực tuyến" (`testhtml-feedback-app`). Nhánh này lưu giữ toàn bộ mã nguồn và cấu hình phục vụ quy mô **Sư đoàn Bộ binh 5 (Quân khu 7)** trước khi dự án được phân nhánh chuyên biệt về Trung đoàn Bộ binh 4.

Ứng dụng là một Web SPA (Single Page Application - Ứng dụng trang đơn) xây dựng trên nền tảng **React 18** và công cụ build **Vite**.

### Mô hình kiến trúc phân lớp:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             NGƯỜI DÙNG / TRÌNH DUYỆT                        │
│                (React 18 SPA • HashRouter • Vanilla CSS Design)              │
└───────────────────────┬─────────────────────────────┬───────────────────────┘
                        │                             │
       [Giao diện Công khai (Client)]         [Giao diện Quản trị (Admin)]
       • Form gửi ý kiến & Tra cứu mã          • Dashboard thống kê (Chart.js)
       • Truyền thống 60 năm Sư đoàn 5         • Quản lý & Phản hồi góp ý
       • Trang câu hỏi thường gặp (FAQ)       • Quản lý Cán bộ & Xuất Excel
                        │                             │
       Public APIs      │                             │ Bearer JWT Token
                        ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY & BACKEND SERVER                        │
│            (Spring Boot / Java • RESTful API • JWT Authentication)          │
│               - Production:  https://api.sudoan5.io.vn                      │
│               - Development: http://192.168.1.236:8080                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CƠ SỞ DỮ LIỆU (DATABASE)                         │
│       • Dữ liệu góp ý (Tracking code, Trạng thái, Nội dung, Phản hồi)       │
│       • Tài khoản cán bộ (ROLE_ADMIN, ROLE_OFFICER)                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Các thành phần hệ thống (Components)

### 1. Luồng Người dùng (Client Flow)
- **Mục đích**: Tiếp nhận ý kiến đóng góp, phản hồi ẩn danh hoặc công khai của cán bộ, chiến sĩ và thân nhân tới chỉ huy Sư đoàn 5; giáo dục truyền thống 60 năm xây dựng và chiến đấu của Sư đoàn.
- **Layout**: [ClientLayout.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/layouts/ClientLayout.jsx) kết hợp [Header.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/Header.jsx), [Footer.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/Footer.jsx), [ContactMenu.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/ContactMenu.jsx).
- **Các trang chính**:
  - [FeedbackPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/client/FeedbackPage.jsx) (`/`):
    - Form gửi góp ý: Người dùng có thể chọn người tiếp nhận từ danh sách cán bộ [officers.js](file:///c:/Users/PC/projects/trungdoan4.online/src/data/officers.js) (Chính trị viên Tiểu đoàn 1, 2, 3, Trưởng ban Dân vận Sư đoàn 5), chọn chế độ ẩn danh hoặc công khai, điền SĐT liên hệ. Nhận mã `trackingCode` từ backend và tự động copy vào clipboard.
    - Tab Tra cứu: Tra cứu tiến độ giải quyết và phản hồi của chỉ huy theo mã `trackingCode`.
  - [TraditionPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/client/TraditionPage.jsx) (`/truyen-thong`):
    - Toàn văn tư liệu lịch sử truyền thống 60 năm của Sư đoàn Bộ binh 5 anh hùng ("Đoàn kết, trung dũng, cơ động linh hoạt, tự lực tự cường, đánh thắng mọi kẻ thù") từ [traditionData.js](file:///c:/Users/PC/projects/trungdoan4.online/src/data/traditionData.js).
  - [FAQPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/client/FAQPage.jsx) (`/faq`):
    - Hệ thống hỏi đáp thường gặp về quyền lợi, nghĩa vụ quân sự và chế độ chính sách từ [faqData.js](file:///c:/Users/PC/projects/trungdoan4.online/src/data/faqData.js).

### 2. Luồng Quản trị (Admin Flow)
- **Mục đích**: Bảng điều khiển quản trị dành cho chỉ huy và cán bộ phụ trách công tác tiếp nhận, xử lý ý kiến.
- **Layout & Bảo vệ**: [AdminLayout.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/layouts/AdminLayout.jsx) được bảo vệ qua [ProtectedRoute.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/ProtectedRoute.jsx).
- **Các trang chính**:
  - [LoginPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/LoginPage.jsx) (`/admin/login`): Đăng nhập xác thực cán bộ, nhận JWT Bearer Token.
  - [DashboardPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/DashboardPage.jsx) (`/admin`): Báo cáo thống kê trực quan (thẻ tóm tắt, biểu đồ Bar & Doughnut qua thư viện **Chart.js** & **react-chartjs-2**).
  - [FeedbackListPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/FeedbackListPage.jsx) (`/admin/gop-y`): Danh sách ý kiến góp ý phân trang từ server, lọc trạng thái (`ALL`, `PENDING`, `RESOLVED`), lọc khoảng ngày, phản hồi và xuất báo cáo Excel qua [ExportModal.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/ExportModal.jsx).
  - [UserManagementPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/UserManagementPage.jsx) (`/admin/can-bo`): Quản lý danh sách tài khoản cán bộ trong hệ thống (chỉ dành cho `ROLE_ADMIN`).

### 3. Dữ liệu & Tiện ích (Data & Utilities)
- [traditionData.js](file:///c:/Users/PC/projects/trungdoan4.online/src/data/traditionData.js): Dữ liệu truyền thống Sư đoàn Bộ binh 5.
- [officers.js](file:///c:/Users/PC/projects/trungdoan4.online/src/data/officers.js): Danh sách cán bộ tiếp nhận cấp Sư đoàn/Tiểu đoàn.
- [exportUtils.js](file:///c:/Users/PC/projects/trungdoan4.online/src/utils/exportUtils.js): Hàm xuất Excel quy chuẩn font Times New Roman, size 14 sử dụng **ExcelJS** & **file-saver**.
- [AuthContext.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/contexts/AuthContext.jsx): Quản lý trạng thái xác thực và hàm `authFetch` tự động bắt mã lỗi HTTP 401.

---

## Luồng dữ liệu (Data Flow)

1. **Gửi góp ý:** Người dùng chọn cán bộ xử lý từ dropdown, điền nội dung và bấm gửi -> Frontend gọi `POST /suggestions` -> Backend lưu DB, cấp `trackingCode` -> Frontend hiển thị và tự sao chép mã.
2. **Tra cứu:** Người dùng nhập mã -> Frontend gọi `GET /suggestions/lookup/{code}` -> Hiển thị trạng thái xử lý và phản hồi.
3. **Quản trị & Phản hồi:** Cán bộ đăng nhập lấy Bearer token -> Gọi `GET /suggestions/paged` lấy danh sách -> Nhập phản hồi gửi `PUT /suggestions/{id}/reply` -> Chuyển trạng thái sang `RESOLVED`.
4. **Xuất báo cáo Excel:** Chọn khoảng thời gian trong ExportModal -> Gọi `GET /suggestions/export` -> `ExcelJS` định dạng bảng tính và `file-saver` tải file về máy.

---

## Điểm tích hợp API (Integration Points)

| Phương thức | Endpoint | Quyền hạn | Mô tả chức năng |
|:-----------:|:---------|:---------:|:----------------|
| `POST` | `/suggestions` | Public | Tiếp nhận góp ý mới |
| `GET` | `/suggestions/lookup/{code}` | Public | Tra cứu góp ý theo mã tracking |
| `POST` | `/auth/login` | Public | Đăng nhập tài khoản cán bộ |
| `GET` | `/suggestions/paged` | Authenticated | Danh sách góp ý phân trang, lọc trạng thái & ngày |
| `PUT` | `/suggestions/{id}/reply` | Authenticated | Phản hồi ý kiến góp ý |
| `DELETE` | `/suggestions/{id}` | Authenticated | Xóa mềm góp ý |
| `GET` | `/suggestions/stats` | Authenticated | Dữ liệu thống kê biểu đồ Dashboard |
| `GET` | `/suggestions/export` | Authenticated | Dữ liệu xuất báo cáo Excel |
| `GET` | `/users` | Authenticated (Admin) | Danh sách tài khoản cán bộ |
| `POST` | `/users` | Authenticated (Admin) | Tạo mới tài khoản cán bộ |
| `DELETE` | `/users/{id}` | Authenticated (Admin) | Xóa tài khoản cán bộ |

---

## Nợ kỹ thuật trên nhánh Sư đoàn 5 (Technical Debt)

1. **Chưa có cơ chế phân cấp đơn vị tự động**: Việc tiếp nhận đang gắn trực tiếp với cán bộ qua file tĩnh `officers.js`, chưa có cây cấu trúc đơn vị độc lập như nhánh `trungdoan4`.
2. **Kiểm tra phiên làm việc hết hạn còn cơ bản**: `AuthContext.jsx` trên nhánh này chưa có hook `useLocation` và hàm `isTokenExpired` decode client-side, dẫn đến nguy cơ modal hết hạn phiên hiển thị đè lên trang login nếu token quá hạn.
3. **Chưa có chức năng chỉnh sửa tài khoản cán bộ**: Trang `UserManagementPage.jsx` chỉ có tạo và xóa, chưa có cập nhật thông tin (`PUT /users/{id}`).
4. **Thiếu kiểm thử tự động và TypeScript**: Toàn bộ codebase viết bằng JSX thuần, chưa có unit test.

---

*Tài liệu được cập nhật lần cuối: 14/09/2026 bởi /map trên nhánh sudoan5*
