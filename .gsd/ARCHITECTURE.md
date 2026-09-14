# Kiến trúc Hệ thống (System Architecture)

> Tự động tạo và cập nhật bởi lệnh `/map` vào ngày 14/09/2026

## Tổng quan (Overview)

Ứng dụng **"Hòm thư góp ý trực tuyến Trung đoàn 4"** (`testhtml-feedback-app`) là một ứng dụng Web SPA (Single Page Application - Ứng dụng trang đơn) được xây dựng dựa trên nền tảng **React 18** và công cụ build/bundler **Vite**.

Hệ thống được thiết kế để giải quyết nhu cầu tiếp nhận, phân loại và xử lý ý kiến đóng góp của chiến sĩ, thân nhân và cán bộ thuộc **Trung đoàn Bộ binh 4**; đồng thời cung cấp cổng tra cứu minh bạch và trung tâm quản trị, thống kê số liệu cho chỉ huy các cấp.

### Mô hình kiến trúc phân lớp:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             NGƯỜI DÙNG / TRÌNH DUYỆT                        │
│                (React 18 SPA • HashRouter • Vanilla CSS Design)              │
└───────────────────────┬─────────────────────────────┬───────────────────────┘
                        │                             │
       [Giao diện Công khai (Client)]         [Giao diện Quản trị (Admin)]
       • Form gửi ý kiến & Tra cứu             • Dashboard thống kê (Chart.js)
       • Trang truyền thống Trung đoàn 4      • Quản lý & Phản hồi góp ý
       • Trang câu hỏi thường gặp (FAQ)       • Quản lý Cán bộ & Xuất Excel
                        │                             │
       Public APIs      │                             │ Bearer JWT Token
                        ▼                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY & BACKEND SERVER                        │
│            (Spring Boot / Java • RESTful API • JWT Authentication)          │
│               - Production:  https://api.trungdoan4.io.vn                   │
│               - Development: http://192.168.1.236:8080                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CƠ SỞ DỮ LIỆU (DATABASE)                         │
│       • Cấu trúc đơn vị phân cấp: Trung đoàn -> Tiểu đoàn -> Đại đội         │
│       • Dữ liệu góp ý (Tracking code, Trạng thái, Nội dung, Phản hồi)       │
│       • Tài khoản cán bộ (Phân quyền ROLE_ADMIN, ROLE_OFFICER theo đơn vị)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Các thành phần hệ thống (Components)

### 1. Luồng Người dùng (Client Flow)
- **Mục đích**: Cung cấp cổng tiếp nhận thông tin từ chiến sĩ, thân nhân chiến sĩ và các tổ chức quần chúng; giới thiệu lịch sử, truyền thống Trung đoàn Bộ binh 4.
- **Layout & Routing**: [ClientLayout.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/layouts/ClientLayout.jsx), sử dụng [Header.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/Header.jsx), [Footer.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/Footer.jsx), [ContactMenu.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/ContactMenu.jsx).
- **Các trang chính**:
  - [FeedbackPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/client/FeedbackPage.jsx) (`/`):
    - Tab **Gửi góp ý**: Chọn đơn vị tiếp nhận qua 2 cấp (Cấp 1: Tiểu đoàn 1, 2, 3 hoặc Đại đội trực thuộc; Cấp 2: Đại đội cụ thể / Khối trực thuộc); nhập nội dung góp ý, tùy chọn ẩn danh / tên người gửi, số điện thoại liên hệ. Nhận lại mã `trackingCode` và tự động sao chép vào clipboard.
    - Tab **Tra cứu trạng thái**: Tra cứu tình trạng xử lý và nội dung phản hồi từ cán bộ bằng mã `trackingCode`.
  - [TraditionPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/client/TraditionPage.jsx) (`/truyen-thong`):
    - Giới thiệu chặng đường lịch sử vẻ vang, các mốc son, danh hiệu anh hùng, truyền thống vẻ vang và video tư liệu về Trung đoàn Bộ binh 4. Nguồn dữ liệu từ [traditionData.js](file:///c:/Users/PC/projects/trungdoan4.online/src/data/traditionData.js).
  - [FAQPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/client/FAQPage.jsx) (`/faq`):
    - Trình bày danh sách câu hỏi - giải đáp thường gặp (chế độ chính sách, rèn luyện kỷ luật, nghỉ phép, liên hệ đơn vị) từ [faqData.js](file:///c:/Users/PC/projects/trungdoan4.online/src/data/faqData.js).

### 2. Luồng Quản trị (Admin Flow)
- **Mục đích**: Cung cấp bảng điều khiển chỉ huy, quản lý và phản hồi ý kiến góp ý, phân cấp quản lý theo đơn vị và quản lý nhân sự cán bộ.
- **Layout & Protection**: [AdminLayout.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/layouts/AdminLayout.jsx) được bảo vệ bởi [ProtectedRoute.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/ProtectedRoute.jsx) và [AuthContext.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/contexts/AuthContext.jsx).
- **Các trang chính**:
  - [LoginPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/LoginPage.jsx) (`/admin/login`):
    - Đăng nhập xác thực tài khoản cán bộ, nhận JWT Bearer Token, lưu trữ phiên vào LocalStorage và AuthContext.
  - [DashboardPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/DashboardPage.jsx) (`/admin`):
    - Báo cáo chỉ huy trực quan: Các thẻ số liệu tổng quan (Tổng góp ý, Đã xử lý, Chờ tiếp nhận, Tỉ lệ hoàn thành).
    - Biểu đồ cột (Bar Chart) và tròn (Doughnut Chart) hiển thị diễn biến góp ý theo ngày, theo tuần, tháng, quý hoặc khoảng ngày tùy chọn thông qua **Chart.js** & **react-chartjs-2**.
  - [FeedbackListPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/FeedbackListPage.jsx) (`/admin/gop-y`):
    - Danh sách góp ý chi tiết với phân trang từ server (`page`, `size`), bộ lọc trạng thái (`ALL`, `PENDING`, `RESOLVED`), bộ lọc khoảng ngày (`from`, `to`), bộ lọc theo đơn vị (`unitCode`).
    - Phản hồi ý kiến (`PUT /suggestions/{id}/reply`), xóa mềm (`DELETE /suggestions/{id}`), sao chép nhanh số điện thoại và gọi điện trực tiếp.
    - Kích hoạt [ExportModal.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/ExportModal.jsx) để xuất dữ liệu ra file Excel.
  - [UserManagementPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/UserManagementPage.jsx) (`/admin/can-bo`):
    - Trang dành riêng cho `ROLE_ADMIN`. Quản lý danh sách cán bộ, tạo mới tài khoản cán bộ gắn với đơn vị công tác (`unitCode`) và quyền hạn (`ROLE_ADMIN` hoặc `ROLE_OFFICER`), xóa tài khoản cán bộ.

### 3. Cấu trúc dữ liệu & Đơn vị (Data & Units)
- [unitsData.js](file:///c:/Users/PC/projects/trungdoan4.online/src/data/unitsData.js):
  - Khai báo cây đơn vị phân cấp (`unitsHierarchy`) của Trung đoàn 4:
    - **Trung đoàn Bộ binh 4** (`TRUNG_DOAN_4`)
      - **Tiểu đoàn 1** (`TD1`): Đại đội 1, 2, 3, 4, Khối trực thuộc Tiểu đoàn 1
      - **Tiểu đoàn 2** (`TD2`): Đại đội 5, 6, 7, 8, Khối trực thuộc Tiểu đoàn 2
      - **Tiểu đoàn 3** (`TD3`): Đại đội 9, 10, 11, 12, Khối trực thuộc Tiểu đoàn 3
      - **Đại đội trực thuộc Trung đoàn** (`DIRECT_COMPANIES`): c14, c15, c16, c17, c18, c20, c24, c25
  - Cung cấp hàm tiện ích `getUnitName(code)` phục vụ tra cứu tên đơn vị nhanh chóng.
- [traditionData.js](file:///c:/Users/PC/projects/trungdoan4.online/src/data/traditionData.js): Dữ liệu truyền thống, ảnh tư liệu, mốc thời gian và video.
- [faqData.js](file:///c:/Users/PC/projects/trungdoan4.online/src/data/faqData.js): Dữ liệu câu hỏi thường gặp theo các chuyên đề.

### 4. Tiện ích & Quản lý phiên (Utils & Contexts)
- [AuthContext.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/contexts/AuthContext.jsx):
  - Lưu trữ `user`, `token`, trạng thái tải `isLoading`, cờ hết hạn phiên `isSessionExpired`.
  - Cung cấp hàm `isTokenExpired(token)` decode payload JWT tại client để phát hiện token hết hạn ngay lập tức mà không cần gửi request lỗi.
  - Cung cấp hàm `authFetch(url, options)` tự động đính kèm `Authorization: Bearer <token>`, bắt mã lỗi HTTP 401 để tự động dọn dẹp state và mở modal thông báo hết hạn.
  - Sử dụng `useLocation()` để ngăn chặn modal hết hạn phiên hiển thị đè lên màn hình login hoặc các trang công khai client.
- [exportUtils.js](file:///c:/Users/PC/projects/trungdoan4.online/src/utils/exportUtils.js):
  - Tính toán khoảng thời gian (tuần, tháng, quý hiện tại, định dạng thời gian API ISO).
  - Xuất báo cáo Excel quy chuẩn bằng thư viện **ExcelJS** & **file-saver**: font Times New Roman, cỡ chữ 14, viền ô, căn lề và định dạng tiêu đề chuẩn quân đội.

---

## Luồng dữ liệu (Data Flow)

### 1. Luồng Gửi góp ý & Tra cứu (Client)
1. Người gửi chọn Tiểu đoàn / Đại đội tiếp nhận từ dropdown phân cấp liên động (cascade select).
2. Người gửi nhập nội dung, thông tin người gửi, số điện thoại rồi nhấn **Gửi góp ý**.
3. Frontend gọi `POST /suggestions` với body: `{ body, suggestedBy, unitCode, contactPhone }`.
4. Backend lưu bản ghi, sinh mã `trackingCode` độc duy và trả về.
5. Frontend hiển thị thông báo thành công, tự động copy mã `trackingCode` vào bộ nhớ đệm.
6. Người gửi có thể chuyển sang tab **Tra cứu**, nhập mã để gọi `GET /suggestions/lookup/{code}` xem trạng thái và nội dung giải quyết của đơn vị.

### 2. Luồng Quản trị & Phản hồi góp ý (Admin)
1. Cán bộ đăng nhập tại `/admin/login`, gọi `POST /auth/login`.
2. Backend xác thực thành công và trả về JWT Bearer token kèm thông tin cơ bản.
3. Cán bộ truy cập danh sách góp ý tại `/admin/gop-y`, frontend gọi `GET /suggestions/paged?...` qua `authFetch`.
4. Cán bộ nhấn **Phản hồi**, nhập nội dung giải quyết và gửi qua `PUT /suggestions/{id}/reply`.
5. Trạng thái của góp ý chuyển thành `RESOLVED`. Người gửi khi tra cứu bằng mã sẽ thấy nội dung phản hồi này ngay lập tức.

### 3. Luồng Xuất dữ liệu báo cáo (Admin)
1. Cán bộ bấm **Xuất Excel** trên thanh công cụ quản trị.
2. [ExportModal.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/ExportModal.jsx) cho phép chọn phạm vi thời gian (tuần này, tháng này, quý hoặc tự chọn).
3. Gọi API `GET /suggestions/export?from=...&to=...`.
4. Hàm `exportToExcel()` trong `exportUtils.js` nhận mảng dữ liệu, dùng **ExcelJS** render bảng tính chuẩn hóa và dùng **file-saver** lưu file `.xlsx` trực tiếp trên máy client.

---

## Danh mục Điểm tích hợp API (Integration Points)

| STT | Phương thức | Endpoint | Phạm vi | Mục đích |
|:---:|:-----------:|:---------|:--------|:---------|
| 1 | `POST` | `/suggestions` | Public | Tạo mới ý kiến đóng góp |
| 2 | `GET` | `/suggestions/lookup/{code}` | Public | Tra cứu ý kiến theo mã tracking |
| 3 | `POST` | `/auth/login` | Public | Đăng nhập cán bộ nhận JWT token |
| 4 | `GET` | `/suggestions/paged` | Authenticated | Lấy danh sách góp ý phân trang, lọc trạng thái & ngày |
| 5 | `PUT` | `/suggestions/{id}/reply` | Authenticated | Gửi phản hồi nội dung góp ý |
| 6 | `DELETE` | `/suggestions/{id}` | Authenticated | Xóa mềm một ý kiến góp ý |
| 7 | `GET` | `/suggestions/stats` | Authenticated | Lấy số liệu thống kê cho Dashboard |
| 8 | `GET` | `/suggestions/export` | Authenticated | Lấy dữ liệu phục vụ xuất báo cáo Excel |
| 9 | `GET` | `/users` | Authenticated (Admin) | Lấy danh sách tài khoản cán bộ |
| 10 | `POST` | `/users` | Authenticated (Admin) | Tạo tài khoản cán bộ mới kèm đơn vị |
| 11 | `DELETE` | `/users/{id}` | Authenticated (Admin) | Xóa tài khoản cán bộ |

---

## Quy ước Phát triển (Development Conventions)

- **Định tuyến (Routing)**: Sử dụng `<HashRouter>` để đảm bảo tương thích tuyệt đối khi triển khai trên các môi trường hosting tĩnh (GitHub Pages, máy chủ web nội bộ không cần rewrite URL rules).
- **Quy tắc đặt tên file**:
  - Components, Pages, Layouts: PascalCase (ví dụ: `FeedbackListPage.jsx`, `WelcomeModal.jsx`).
  - Utils, Data, Helpers: camelCase (ví dụ: `exportUtils.js`, `unitsData.js`).
- **Styling**: Sử dụng **Vanilla CSS** riêng cho từng component (`ComponentName.css`), kết hợp bảng biến CSS toàn cục chuẩn trong `src/styles/global.css` (`--red-600`, `--gold-500`, `--sky-600`, v.v.).
- **Quản lý xác thực**: Mọi request yêu cầu đăng nhập bắt buộc phải qua `authFetch` trong `AuthContext` để tự động đính kèm `Bearer token` và xử lý mã lỗi 401 khi phiên làm việc hết hạn.

---

## Nợ kỹ thuật & Điểm cần nâng cấp (Technical Debt)

1. **Bộ lọc đơn vị phía Client trên danh sách phân trang (Quan trọng)**:
   - Trong `FeedbackListPage.jsx`, bộ lọc `selectedUnitFilter` hiện đang dùng `feedbacks.filter(...)` cục bộ trên danh sách 1 trang (`pageSize = 10`). Nếu đơn vị có nhiều góp ý trải dài trên nhiều trang, việc lọc phía client sẽ bỏ sót dữ liệu. Cần chuyển tham số lọc `unitCode` vào query param của API `GET /suggestions/paged`.
2. **Thiếu lưu trữ `unitCode` trong User state khi đăng nhập**:
   - `LoginPage.jsx` khi đăng nhập chỉ lưu `{ username, fullName, role }`, chưa lưu `unitCode` của cán bộ vào `user` object trong `AuthContext`. Cần đồng bộ `unitCode` từ token hoặc response login để phục vụ phân quyền dữ liệu theo đơn vị.
3. **Quản lý người dùng chưa có tính năng Cập nhật (Edit)**:
   - `UserManagementPage.jsx` hiện chỉ có chức năng tạo mới và xóa tài khoản; chưa hỗ trợ chỉnh sửa thông tin cá nhân, chuyển đơn vị công tác (`unitCode`) hoặc phân quyền (`PUT /users/{id}`). (Dự kiến hoàn thiện trong Phase 6).
4. **Hình thức gửi góp ý vẫn hỗ trợ ẩn danh**:
   - `FeedbackPage.jsx` hiện vẫn cho phép chọn "Ẩn danh" và số điện thoại không bắt buộc. Cần chuyển đổi sang chế độ bắt buộc công khai và xác thực số điện thoại theo mục tiêu của Phase 6.
5. **Tệp và mã nguồn mồ côi (Dead code)**:
   - `src/data/officers.js`: Danh sách cán bộ cũ (còn sót đơn vị Sư đoàn 5) không còn được sử dụng ở bất kỳ component nào.
   - `src/utils/helpers.js`: Chứa hàm `createFeedbackCode` sinh mã `GY-XXXXXX` ở client, hiện không còn dùng do mã tra cứu đã được backend sinh tự động.
6. **Chưa áp dụng TypeScript & Thiếu kiểm thử tự động**:
   - Dự án hoàn toàn viết bằng JavaScript thuần (JSX), thiếu Type checking và chưa có bộ kiểm thử tự động (Unit Test / Integration Test).
7. **Cơ chế tái cấp phiên (Refresh Token)**:
   - Hiện tại hệ thống kiểm tra JWT hết hạn và buộc người dùng đăng nhập lại từ đầu; chưa có cơ chế refresh token âm thầm trong nền (Silent Token Refresh).

---

*Tài liệu được cập nhật lần cuối: 14/09/2026 bởi /map*
