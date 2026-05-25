# Kiến trúc Hệ thống (System Architecture)

> Tự động tạo bởi lệnh `/map` vào ngày 25/05/2026

## Tổng quan (Overview)
Ứng dụng "Hòm thư góp ý trực tuyến Trung đoàn 4" (testhtml-feedback-app) là một ứng dụng Web SPA (Single Page Application - Ứng dụng trang đơn) được xây dựng dựa trên thư viện **React** và công cụ đóng gói **Vite**.

Ứng dụng phục vụ hai nhóm đối tượng chính:
1. **Người dùng (Client)**: Gửi các ý kiến đóng góp, phản hồi ẩn danh hoặc công khai tới đơn vị, đồng thời tra cứu trạng thái xử lý các góp ý đó thông qua mã tra cứu độc duy. Đọc thông tin truyền thống của Trung đoàn Bộ binh 4 và tra cứu các câu hỏi thường gặp (FAQ).
2. **Quản trị viên / Cán bộ (Admin)**: Đăng nhập vào hệ thống để thống kê số liệu góp ý (qua biểu đồ trực quan), quản lý danh sách góp ý, phản hồi ý kiến của chiến sĩ/thân nhân, quản lý tài khoản cán bộ và xuất báo cáo dữ liệu định dạng Excel.

Sơ đồ hoạt động mức cao:
```
┌───────────────────────────────────────────────────────────────┐
│                          Trình duyệt                          │
│             (React SPA / HashRouter / Vanilla CSS)            │
└───────┬───────────────────────────────────────────────┬───────┘
        │ Gửi góp ý, Tra cứu                            │ Đăng nhập, Thống kê,
        │ (Public APIs)                                 │ Xử lý (Authenticated APIs)
        ▼                                               ▼
┌───────────────────────────────────────────────────────────────┐
│                    API Gateway / Backend                      │
│             (Sử dụng JWT Bearer Token để xác thực)            │
│               https://api.trungdoan4.io.vn                    │
└───────────────────────────────────────────────────────────────┘
```

## Các thành phần hệ thống (Components)

### 1. Luồng Người dùng (Client Flow)
- **Mục đích**: Giao diện công khai dành cho chiến sĩ, thân nhân và cán bộ để tra cứu thông tin hoặc gửi ý kiến đóng góp.
- **Vị trí**: `src/pages/client/` và `src/layouts/ClientLayout.jsx`
- **Các trang chính**:
  - [FeedbackPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/client/FeedbackPage.jsx) (`/`): Form gửi góp ý (cho phép chọn Ẩn danh hoặc Công khai, điền SĐT liên hệ, chọn cán bộ xử lý) và chức năng tra cứu trạng thái xử lý góp ý theo mã tra cứu (`trackingCode`).
  - [TraditionPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/client/TraditionPage.jsx) (`/truyen-thong`): Trang giới thiệu lịch sử, truyền thống xây dựng và chiến đấu của Trung đoàn Bộ binh 4 anh hùng kèm theo danh sách phim tài liệu.
  - [FAQPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/client/FAQPage.jsx) (`/faq`): Câu hỏi thường gặp liên quan đến chế độ sinh hoạt, chế độ nghỉ phép, chính sách thân nhân, v.v.

### 2. Luồng Quản trị (Admin Flow)
- **Mục đích**: Khu vực được bảo vệ để cán bộ quản trị và chỉ huy đơn vị thống kê, tiếp nhận và phản hồi các ý kiến góp ý.
- **Vị trí**: `src/pages/admin/` và `src/layouts/AdminLayout.jsx`
- **Các trang chính**:
  - [LoginPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/LoginPage.jsx) (`/admin/login`): Đăng nhập bằng tài khoản cán bộ để nhận JWT Bearer Token.
  - [DashboardPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/DashboardPage.jsx) (`/admin`): Tổng quan thống kê số liệu góp ý. Tích hợp **Chart.js** và **react-chartjs-2** để hiển thị biểu đồ cột (Bar) và biểu đồ tròn (Doughnut).
  - [FeedbackListPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/FeedbackListPage.jsx) (`/admin/gop-y`): Danh sách góp ý chi tiết, hỗ trợ lọc theo trạng thái (PENDING/RESOLVED), lọc theo khoảng ngày, phân trang, phản hồi/cập nhật phản hồi, và gọi chức năng xuất Excel.
  - [UserManagementPage.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/pages/admin/UserManagementPage.jsx) (`/admin/can-bo`): Quản lý danh sách tài khoản cán bộ trong hệ thống (chỉ dành cho tài khoản Admin).

### 3. Thành phần dùng chung & Tiện ích (Shared & Utils)
- **Vị trí**: `src/components/`, `src/contexts/`, `src/utils/`
- **Các file chính**:
  - [AuthContext.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/contexts/AuthContext.jsx): Quản lý trạng thái đăng nhập, lưu trữ token, và cung cấp hàm `authFetch` tự động chèn header Authorization và xử lý khi phiên đăng nhập hết hạn (HTTP 401).
  - [ProtectedRoute.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/ProtectedRoute.jsx): Component bảo vệ các tuyến đường Admin, chuyển hướng về trang đăng nhập nếu chưa xác thực, hoặc giới hạn quyền admin.
  - [exportUtils.js](file:///c:/Users/PC/projects/trungdoan4.online/src/utils/exportUtils.js): Chứa hàm xuất Excel chất lượng cao (Times New Roman, size 14, định dạng header và border) sử dụng **ExcelJS** và **file-saver**.
  - [Modal.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/Modal.jsx), [WelcomeModal.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/WelcomeModal.jsx), [ExportModal.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/ExportModal.jsx), [TabToggle.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/TabToggle.jsx), [Header.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/Header.jsx), [Footer.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/Footer.jsx), [ContactMenu.jsx](file:///c:/Users/PC/projects/trungdoan4.online/src/components/ContactMenu.jsx): Các component giao diện dùng chung viết bằng Vanilla CSS.

## Luồng dữ liệu (Data Flow)

### 1. Luồng Gửi và Tra cứu Góp ý (Client)
1. Người dùng truy cập trang chủ (`/`), nhập nội dung góp ý và bấm **Gửi**.
2. Hệ thống gọi API `POST /suggestions` tới Backend.
3. Backend tạo bản ghi, sinh mã tra cứu `trackingCode` ngẫu nhiên và lưu vào cơ sở dữ liệu (Database), sau đó phản hồi lại mã này.
4. Giao diện React hiển thị thông báo thành công kèm mã tra cứu và tự động sao chép (copy) vào khay nhớ tạm (Clipboard) của người dùng.
5. Người dùng có thể nhập mã này tại tab **Tra cứu trạng thái** (gọi API `GET /suggestions/lookup/{code}`) để xem phản hồi từ cán bộ có thẩm quyền.

### 2. Luồng Phản hồi Góp ý (Admin)
1. Cán bộ đăng nhập thành công, nhận JWT lưu vào LocalStorage và đi đến trang **Quản lý góp ý**.
2. Hệ thống gọi API `GET /suggestions/paged` kèm theo token trong header `Authorization: Bearer <token>`.
3. Cán bộ bấm vào nút **Phản hồi**, nhập nội dung giải quyết và bấm **Xác nhận gửi**.
4. Hệ thống gọi API `PUT /suggestions/{id}/reply` gửi kèm dữ liệu phản hồi.
5. Trạng thái của góp ý chuyển từ `PENDING` sang `RESOLVED`. Người dùng ngoài client khi tra cứu bằng mã sẽ thấy nội dung phản hồi này.

## Quy ước Code (Coding Conventions)
- **Định dạng file (File Naming)**: Tên Component và Layout viết hoa chữ cái đầu (PascalCase, ví dụ: `WelcomeModal.jsx`). Tên Utility và Data viết thường chữ cái đầu (camelCase, ví dụ: `exportUtils.js`).
- **CSS**: Sử dụng Vanilla CSS viết trong các file `.css` tương ứng với Component/Page để tối ưu tính đóng gói, tránh đụng độ class.
- **Xác thực (Authentication)**: Mọi yêu cầu API trong khu vực Admin phải đi qua hàm `authFetch` trong `AuthContext` để đảm bảo bảo mật và tự động bắt lỗi hết hạn phiên (HTTP 401).

## Nợ kỹ thuật (Technical Debt)
- [ ] Chưa cấu hình TypeScript để tăng tính an toàn kiểu dữ liệu.
- [ ] Thiếu kiểm thử tự động (Unit Test / Integration Test) cho các luồng xử lý chính.
- [ ] Menu Cán bộ xử lý trên giao diện gửi góp ý hiện đang được ẩn (`display: none`) do thay đổi nghiệp vụ phân công tự động từ backend, cần tối ưu hóa hoặc loại bỏ mã code thừa này.
- [ ] Cấu hình API URL trực tiếp từ biến môi trường của Vite, chưa có giải pháp dự phòng (fallback) động nếu file `.env` bị thiếu.

---

*Last updated: 2026-05-25*
