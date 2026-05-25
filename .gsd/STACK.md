# Danh mục Công nghệ (Technology Stack)

> Tự động tạo bởi lệnh `/map` vào ngày 25/05/2026

## Môi trường chạy (Runtime)

| Công nghệ | Phiên bản | Vai trò |
|-----------|-----------|---------|
| Node.js | v18+ | Môi trường chạy JavaScript phục vụ phát triển, build & chạy dev server |
| Vite | ^5.4.10 | Công cụ xây dựng và đóng gói (Build tool & Bundler) |

## Công nghệ lõi (Core Technologies)

### Thư viện & Framework
| Tên công nghệ | Phiên bản | Vai trò |
|---------------|-----------|---------|
| React | ^18.3.1 | Thư viện giao diện chính (UI Library) |
| React DOM | ^18.3.1 | Kết xuất giao diện React lên cây DOM của trình duyệt |
| React Router Dom | ^7.14.1 | Quản lý định tuyến trang (Routing) |

### Thống kê & Tiện ích
| Tên công nghệ | Phiên bản | Vai trò |
|---------------|-----------|---------|
| Chart.js | ^4.5.1 | Thư viện vẽ biểu đồ HTML5 |
| React Chartjs 2 | ^5.3.1 | React wrapper cho Chart.js |
| ExcelJS | ^4.4.0 | Đọc, ghi và định dạng file Excel (.xlsx) |
| File Saver | ^2.0.5 | Lưu file xuất ra trực tiếp từ trình duyệt xuống máy khách |

## Dependencies

### Production Dependencies (Thư viện chạy thực tế)
Xem chi tiết trong [package.json](file:///c:/Users/PC/projects/trungdoan4.online/package.json):
- `chart.js`: ^4.5.1
- `exceljs`: ^4.4.0
- `file-saver`: ^2.0.5
- `react`: ^18.3.1
- `react-chartjs-2`: ^5.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^7.14.1
- `xlsx`: ^0.18.5

### Development Dependencies (Thư viện phục vụ phát triển)
- `@vitejs/plugin-react`: ^4.3.1 (Tích hợp React vào Vite)
- `gh-pages`: ^6.3.0 (Hỗ trợ deploy ứng dụng tĩnh lên GitHub Pages)
- `vite`: ^5.4.10 (Hệ thống build & dev server)

## Cấu hình môi trường (Configuration)

| Biến môi trường | Ý nghĩa / Mục đích | Nơi thiết lập |
|-----------------|--------------------|---------------|
| `VITE_API_BASE_URL` | Địa chỉ API Endpoint của backend | `.env.development` (`http://192.168.1.236:8080`) <br> `.env.production` (`https://api.trungdoan4.io.vn`) |

## Phân bổ dòng code (File Size Inventory)

Dưới đây là thống kê số dòng mã nguồn của dự án (xấp xỉ):

| Thư mục / Thành phần | Số lượng tệp | Tổng số dòng code (approx) |
|-----------------------|--------------|---------------------------|
| Giao diện chính (`src/App.jsx`, `src/main.jsx`) | 2 | ~60 |
| Layout (`src/layouts/`) | 4 | ~277 |
| Component (`src/components/`) | 15 | ~1728 |
| Giao diện Quản trị (`src/pages/admin/`) | 6 | ~1502 |
| Giao diện Người dùng (`src/pages/client/`) | 6 | ~964 |
| Dữ liệu tĩnh (`src/data/`) | 3 | ~179 |
| Tiện ích & Context (`src/utils/`, `src/contexts/`) | 3 | ~253 |
| CSS toàn cục (`src/styles/global.css`) | 1 | ~286 |
| **Tổng cộng** | **40** | **~5249 dòng** |

## Thư viện lỗi thời cần nâng cấp (Outdated Packages)

| Thư viện | Phiên bản hiện tại | Phiên bản mới nhất | Mức độ rủi ro |
|----------|--------------------|--------------------|---------------|
| `vite` | 5.4.21 | 8.0.13 | Trung bình (Nên nâng cấp để cải thiện build performance) |
| `react` / `react-dom` | 18.3.1 | 19.2.6 | Cao (Có các thay đổi lớn về API, cần kiểm tra kỹ độ tương thích trước khi nâng cấp) |
| `@vitejs/plugin-react` | 4.7.0 | 6.0.2 | Thấp |
| `react-router-dom` | 7.14.1 | 7.15.1 | Thấp |

---

*Last updated: 2026-05-25*
