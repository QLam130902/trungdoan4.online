---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Phân nhánh quy mô Trung đoàn 4 (FE & BE) và khôi phục nhánh chính Sư đoàn 5

## Objective
Tạo lập các nhánh Git chuyên biệt mang tên `trungdoan4` để lưu trữ và phát triển quy mô Trung đoàn 4 ở cả dự án Frontend (FE) và Backend (BE). Đồng thời, đưa nhánh làm việc chính `local` của cả FE và BE trở về cấu hình quy mô Sư đoàn 5.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/phases/2/RESEARCH.md

## Tasks

<task type="auto">
  <name>Phân nhánh và khôi phục nhánh chính của Frontend (trungdoan4.online)</name>
  <files>
    .env.production
    public/CNAME
    src/components/Header.jsx
    src/pages/client/TraditionPage.jsx
    src/components/WelcomeModal.jsx
    src/components/ContactMenu.jsx
    src/pages/client/FeedbackPage.jsx
    src/layouts/AdminLayout.jsx
  </files>
  <action>
    - Đảm bảo đang ở thư mục FE và nhánh local.
    - Tạo nhánh trungdoan4 từ nhánh local hiện tại: git branch trungdoan4 (nhánh này sẽ giữ lại toàn bộ code Trung đoàn 4).
    - Reset hard nhánh local theo nhánh sao lưu sundoan5 để khôi phục cấu hình Sư đoàn 5 trên nhánh chính: git reset --hard sundoan5
  </action>
  <verify>git branch; git log -n 1</verify>
  <done>Nhánh trungdoan4 được tạo chứa code Trung đoàn 4 và nhánh local được khôi phục về code Sư đoàn 5.</done>
</task>

<task type="auto">
  <name>Phân nhánh và cập nhật CORS của Backend (trungdoan4.server)</name>
  <files>
    c:\Users\PC\projects\trungdoan4.server\src\main\java\vn\homthugopy\config\SecurityConfig.java
  </files>
  <action>
    - Di chuyển sang thư mục dự án BE: c:\Users\PC\projects\trungdoan4.server
    - Tạo và checkout sang nhánh trungdoan4: git checkout -b trungdoan4
    - Sửa dòng 94 trong file SecurityConfig.java từ "https://sudoan5.io.vn" thành "https://trungdoan4.io.vn" để cho phép CORS từ tên miền Trung đoàn 4.
    - Commit thay đổi trên nhánh trungdoan4: git add src/main/java/vn/homthugopy/config/SecurityConfig.java; git commit -m "feat: configure CORS for trungdoan4"
    - Chuyển về lại nhánh chính local của BE: git checkout local
  </action>
  <verify>git branch; git diff local trungdoan4</verify>
  <done>Nhánh trungdoan4 được tạo ở BE với cấu hình CORS cập nhật cho Trung đoàn 4, nhánh local của BE giữ nguyên CORS Sư đoàn 5.</done>
</task>

<task type="auto">
  <name>Kiểm tra biên dịch production của FE trên các nhánh</name>
  <files>
    package.json
  </files>
  <action>
    - Di chuyển về thư mục dự án FE: c:\Users\PC\projects\trungdoan4.online
    - Kiểm tra build trên nhánh local (Sư đoàn 5): chạy npm run build
    - Chuyển sang nhánh trungdoan4: git checkout trungdoan4
    - Kiểm tra build trên nhánh trungdoan4 (Trung đoàn 4): chạy npm run build
    - Chuyển về lại nhánh local (Sư đoàn 5) để giữ trạng thái phát triển Sư đoàn 5: git checkout local
  </action>
  <verify>npm run build</verify>
  <done>Cả hai nhánh local (Sư đoàn 5) và trungdoan4 (Trung đoàn 4) đều chạy build thành công mà không gặp lỗi biên dịch.</done>
</task>

## Success Criteria
- [ ] Nhánh `trungdoan4` được tạo lập ở cả dự án FE và BE lưu trữ cấu hình quy mô Trung đoàn 4.
- [ ] Nhánh chính `local` của cả FE và BE được khôi phục về quy mô Sư đoàn 5.
- [ ] Các dự án build thành công trên cả hai nhánh cấu hình.
