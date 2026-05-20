# Nghiên cứu Kỹ thuật (Research) - Phase 2

## Phân tích hiện trạng Git & Cấu hình

### 1. Dự án Frontend (trungdoan4.online)
- Nhánh hiện tại: `local` (đang chứa toàn bộ code Trung đoàn 4 đã khôi phục ở Phase 1).
- Nhánh sao lưu Sư đoàn 5: `sundoan5` (chứa toàn bộ code Sư đoàn 5 tại thời điểm trước khi rollback).
- Giải pháp chuyển đổi:
  1. Tạo nhánh `trungdoan4` từ nhánh `local` hiện tại: `git branch trungdoan4` (hoặc `git checkout -b trungdoan4`).
  2. Chuyển về nhánh `local`: `git checkout local`.
  3. Reset hard nhánh `local` theo `sundoan5`: `git reset --hard sundoan5`.
  4. Như vậy, nhánh `local` sẽ chứa Sư đoàn 5, còn nhánh `trungdoan4` sẽ chứa Trung đoàn 4.

### 2. Dự án Backend (trungdoan4.server)
- Nhánh hiện tại: `local` (đang chứa cấu hình Sư đoàn 5 - CORS trỏ về `https://sudoan5.io.vn`).
- Giải pháp chuyển đổi:
  1. Tạo nhánh `trungdoan4` từ nhánh `local` hiện tại: `git checkout -b trungdoan4`.
  2. Sửa CORS trong `SecurityConfig.java` dòng 94 từ `"https://sudoan5.io.vn"` thành `"https://trungdoan4.io.vn"`.
  3. Commit thay đổi này trên nhánh `trungdoan4`.
  4. Chuyển về nhánh `local`: `git checkout local`.
  5. Như vậy, nhánh `local` của BE chứa Sư đoàn 5, còn nhánh `trungdoan4` của BE chứa Trung đoàn 4.
