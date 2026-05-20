# Project Specification

**Status:** FINALIZED

## Mục tiêu Dự án (Project Goal)

Hệ thống Hòm thư góp ý trực tuyến cho phép cán bộ, chiến sĩ và thân nhân gửi các phản ánh, góp ý ẩn danh hoặc công khai tới Chỉ huy đơn vị nhằm phát huy dân chủ cơ sở và cải thiện đời sống, kỷ luật đơn vị.

## Cấu trúc Nhánh & Quy mô Đơn vị

Để duy trì đồng thời hai quy mô đơn vị khác nhau và phục vụ quá trình phát triển lâu dài, dự án được tổ chức theo cơ chế phân nhánh Git như sau ở cả Frontend (FE) và Backend (BE):

### 1. Nhánh chính (Quy mô Sư đoàn 5)
- **Tên nhánh:** `local` (hoặc `main`/`master`)
- **Đặc điểm:** 
  - Logo chính thức: Logo Sư đoàn 5 (`logof.png`).
  - Tên hiển thị: Sư đoàn Bộ binh 5.
  - Cấu hình domain production của FE: `sudoan5.io.vn`.
  - Cấu hình API Backend: `https://api.sudoan5.io.vn`.
  - CORS Backend: Cho phép `https://sudoan5.io.vn`.
  - Dữ liệu truyền thống: Lịch sử và danh sách anh hùng của Sư đoàn Bộ binh 5.

### 2. Nhánh phụ chuyên biệt (Quy mô Trung đoàn 4)
- **Tên nhánh:** `trungdoan4`
- **Đặc điểm:**
  - Logo chính thức: Logo Trung đoàn 4 (`logo.png`).
  - Tên hiển thị: Trung đoàn Bộ binh 4 - Sư đoàn 5.
  - Cấu hình domain production của FE: `trungdoan4.io.vn`.
  - Cấu hình API Backend: `https://api.trungdoan4.io.vn`.
  - CORS Backend: Cho phép `https://trungdoan4.io.vn`.
  - Dữ liệu truyền thống: Lịch sử, trận đánh tiêu biểu, danh sách anh hùng của Trung đoàn Bộ binh 4.
