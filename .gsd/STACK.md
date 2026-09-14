# Danh mục Công nghệ (Technology Stack)

> Tự động tạo và cập nhật bởi lệnh `/map` vào ngày 14/09/2026

## Môi trường thực thi (Runtime)

| Công nghệ | Phiên bản khai báo | Phiên bản cài đặt | Vai trò / Mục đích |
|-----------|-------------------|-------------------|---------------------|
| **Node.js** | v18+ | v20+ | Môi trường chạy JavaScript trên máy chủ phát triển và đóng gói |
| **Vite** | `^5.4.10` | 5.4.21 | Build tool & Development Server tốc độ cao |

---

## Công nghệ lõi & Thư viện (Core Technologies & Libraries)

### 1. Nền tảng Giao diện (UI & Routing)
| Tên thư viện | Phiên bản | Mô tả vai trò |
|--------------|-----------|---------------|
| `react` | `^18.3.1` | Thư viện giao diện chính (UI Library) dựa trên Component |
| `react-dom` | `^18.3.1` | Render cây thành phần React lên DOM trình duyệt |
| `react-router-dom` | `^7.14.1` | Quản lý điều hướng định tuyến (sử dụng `HashRouter` cho hosting tĩnh) |

### 2. Thống kê, Biểu đồ & Tiện ích xuất dữ liệu
| Tên thư viện | Phiên bản | Mô tả vai trò |
|--------------|-----------|---------------|
| `chart.js` | `^4.5.1` | Thư viện trực quan hóa dữ liệu qua biểu đồ HTML5 Canvas |
| `react-chartjs-2` | `^5.3.1` | React Wrapper cho Chart.js tích hợp vào Dashboard |
| `exceljs` | `^4.4.0` | Thư viện đọc/ghi và định dạng bảng tính Excel chuyên nghiệp |
| `file-saver` | `^2.0.5` | Hỗ trợ lưu trữ file trực tiếp phía client từ Blob |
| `xlsx` | `^0.18.5` | Hỗ trợ bổ trợ xử lý dữ liệu bảng tính Spreadsheet |

---

## Danh mục Phụ thuộc (Dependencies Inventory)

### Production Dependencies (Thư viện chạy thực tế)
Xem chi tiết trong [package.json](file:///c:/Users/PC/projects/trungdoan4.online/package.json):
- `chart.js`: `^4.5.1`
- `exceljs`: `^4.4.0`
- `file-saver`: `^2.0.5`
- `react`: `^18.3.1`
- `react-chartjs-2`: `^5.3.1`
- `react-dom`: `^18.3.1`
- `react-router-dom`: `^7.14.1`
- `xlsx`: `^0.18.5`

### Development Dependencies (Phục vụ phát triển & Build)
- `@vitejs/plugin-react`: `^4.3.1` (Tích hợp React Fast Refresh vào Vite)
- `gh-pages`: `^6.3.0` (Công cụ deploy bản build tĩnh lên GitHub Pages)
- `vite`: `^5.4.10` (Hệ thống build và bundling cho production)

---

## Cấu hình Môi trường (Environment Configuration)

| Biến môi trường | Mục đích / Tác dụng | Thiết lập cụ thể |
|-----------------|---------------------|------------------|
| `VITE_API_BASE_URL` (Dev) | Điểm kết nối API Backend khi lập trình nội bộ | `http://192.168.1.236:8080` (trong [.env.development](file:///c:/Users/PC/projects/trungdoan4.online/.env.development)) |
| `VITE_API_BASE_URL` (Prod) | Điểm kết nối API Backend trên máy chủ chính thức | `https://api.trungdoan4.io.vn` (trong [.env.production](file:///c:/Users/PC/projects/trungdoan4.online/.env.production)) |

---

## Phân bổ Quy mô Mã nguồn (Codebase Size Inventory)

Thống kê chi tiết số lượng tệp và số dòng mã nguồn trong `src/`:

| Thư mục / Thành phần | Số lượng tệp | Tổng số dòng code | Mô tả chức năng |
|:----------------------|:------------:|:-----------------:|:----------------|
| **Giao diện Gốc** (`src/`) | 2 | 66 | `App.jsx`, `main.jsx` (Khởi tạo App, HashRouter, AuthProvider) |
| **Trang Ứng dụng** (`src/pages/`) | 12 | 3,048 | 6 trang Admin (Dashboard, FeedbackList, Login, UserManagement) + 6 trang Client (Feedback, Tradition, FAQ) |
| **Thành phần Dùng chung** (`src/components/`) | 15 | 1,702 | Header, Footer, Modals, TabToggle, ProtectedRoute, ContactMenu, ExportModal |
| **Khung mẫu Bố cục** (`src/layouts/`) | 4 | 277 | ClientLayout và AdminLayout kèm CSS định dạng |
| **Quản lý Trạng thái & Phiên** (`src/contexts/`) | 1 | 143 | `AuthContext.jsx` (Xác thực JWT, auto-check exp, 401 interceptor) |
| **Dữ liệu Tĩnh & Đơn vị** (`src/data/`) | 4 | 238 | `unitsData.js`, `traditionData.js`, `faqData.js`, `officers.js` |
| **CSS Toàn cục** (`src/styles/`) | 1 | 286 | `global.css` (Bảng biến màu quân ngũ, reset CSS, typography) |
| **Tiện ích & Hỗ trợ** (`src/utils/`) | 2 | 143 | `exportUtils.js` (Xuất Excel, xử lý ngày tháng), `helpers.js` |
| **TỔNG CỘNG** | **41 tệp** | **5,903 dòng** | Toàn bộ mã nguồn phía Frontend |

---

## Phân tích Nâng cấp Thư viện (Outdated Packages Analysis)

Kết quả kiểm tra từ lệnh `npm outdated`:

| Tên Package | Bản đang dùng | Bản tối ưu (Wanted) | Bản mới nhất (Latest) | Đánh giá Mức độ Rủi ro | Khuyến nghị Hành động |
|:------------|:-------------:|:-------------------:|:---------------------:|:-----------------------|:----------------------|
| `react` | 18.3.1 | 18.3.1 | 19.3.0 | ⚠️ **Cao (High)** | Giữ nguyên bản 18.x. React 19 có nhiều breaking changes với các thư viện bên thứ 3 (như react-chartjs-2). |
| `react-dom` | 18.3.1 | 18.3.1 | 19.3.0 | ⚠️ **Cao (High)** | Đồng bộ cùng phiên bản với `react`. |
| `vite` | 5.4.21 | 5.4.21 | 8.3.0 | ⚡ **Trung bình (Medium)** | Vite 5.4 hiện tại hoạt động rất ổn định và tương thích tốt với Node 18/20; có thể nâng cấp trong kế hoạch bảo trì riêng. |
| `@vitejs/plugin-react` | 4.7.0 | 4.7.0 | 6.1.1 | 🟢 **Thấp (Low)** | Có thể xem xét nâng cấp khi nâng cấp Vite. |
| `react-router-dom` | 7.14.1 | 7.18.3 | 7.18.3 | 🟢 **Thấp (Low)** | Phiên bản minor/patch an toàn, có thể cập nhật để nhận các bản vá lỗi routing. |

---

*Tài liệu được cập nhật lần cuối: 14/09/2026 bởi /map*
