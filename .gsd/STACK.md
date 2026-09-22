# Danh mục Công nghệ (Technology Stack) - Nhánh Lưu trữ Sư đoàn 5 (`sudoan5`)

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
| `VITE_API_BASE_URL` (Prod) | Điểm kết nối API Backend trên máy chủ chính thức | `https://api.sudoan5.io.vn` (trong [.env.production](file:///c:/Users/PC/projects/trungdoan4.online/.env.production)) |
| Tên miền công khai | Tên miền tùy chỉnh trên GitHub Pages | `sudoan5.io.vn` (trong [CNAME](file:///c:/Users/PC/projects/trungdoan4.online/public/CNAME)) |

---

## Phân bổ Quy mô Mã nguồn trên nhánh `sudoan5`

Thống kê chi tiết số lượng tệp và số dòng mã nguồn trong `src/`:

| Thư mục / Thành phần | Số lượng tệp | Tổng số dòng code | Mô tả chức năng |
|:----------------------|:------------:|:-----------------:|:----------------|
| **Giao diện Gốc** (`src/`) | 2 | 66 | `App.jsx`, `main.jsx` |
| **Trang Ứng dụng** (`src/pages/`) | 12 | 2,998 | 6 trang Admin (Dashboard, FeedbackList, Login, UserManagement) + 6 trang Client (Feedback, Tradition, FAQ) |
| **Thành phần Dùng chung** (`src/components/`) | 15 | 1,702 | Header, Footer, Modals, TabToggle, ProtectedRoute, ContactMenu, ExportModal |
| **Khung mẫu Bố cục** (`src/layouts/`) | 4 | 277 | ClientLayout và AdminLayout kèm CSS |
| **Quản lý Trạng thái & Phiên** (`src/contexts/`) | 1 | 104 | `AuthContext.jsx` |
| **Dữ liệu Tĩnh** (`src/data/`) | 3 | 179 | `traditionData.js` (Sư đoàn 5), `faqData.js`, `officers.js` |
| **CSS Toàn cục** (`src/styles/`) | 1 | 286 | `global.css` (Bảng biến màu quân ngũ, reset CSS, typography) |
| **Tiện ích & Hỗ trợ** (`src/utils/`) | 2 | 143 | `exportUtils.js`, `helpers.js` |
| **TỔNG CỘNG** | **40 tệp** | **5,755 dòng** | Toàn bộ mã nguồn phía Frontend trên nhánh `sudoan5` |

---

## Phân tích Nâng cấp Thư viện (Outdated Packages Analysis)

Kết quả kiểm tra từ lệnh `npm outdated`:

| Tên Package | Bản đang dùng | Bản tối ưu (Wanted) | Bản mới nhất (Latest) | Đánh giá Mức độ Rủi ro | Khuyến nghị Hành động |
|:------------|:-------------:|:-------------------:|:---------------------:|:-----------------------|:----------------------|
| `react` | 18.3.1 | 18.3.1 | 19.3.0 | ⚠️ **Cao (High)** | Giữ nguyên bản 18.x. React 19 có nhiều breaking changes với các thư viện bên thứ 3. |
| `react-dom` | 18.3.1 | 18.3.1 | 19.3.0 | ⚠️ **Cao (High)** | Đồng bộ cùng phiên bản với `react`. |
| `vite` | 5.4.21 | 5.4.21 | 8.3.0 | ⚡ **Trung bình (Medium)** | Vite 5.4 hoạt động rất ổn định; nâng cấp khi có kế hoạch bảo trì riêng. |
| `@vitejs/plugin-react` | 4.7.0 | 4.7.0 | 6.1.1 | 🟢 **Thấp (Low)** | Có thể cập nhật đồng thời với Vite. |
| `react-router-dom` | 7.14.1 | 7.18.3 | 7.18.3 | 🟢 **Thấp (Low)** | Có thể cập nhật an toàn. |

---

*Tài liệu được cập nhật lần cuối: 14/09/2026 bởi /map trên nhánh sudoan5*
