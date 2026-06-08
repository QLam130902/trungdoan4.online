---
milestone: Chuyển đổi Quy mô Dự án
version: 1.2.0
updated: 2026-06-08T15:45:00+07:00
---

# Roadmap

> **Current Phase:** Phase 5: Điều tra và khắc phục triệt để lỗi hết hạn token trên hệ thống
> **Status:** in_progress

## Must-Haves (from SPEC)

- [x] Lưu trữ phiên bản Sư đoàn 5 hiện tại sang nhánh `sundoan5`
- [x] Khôi phục cấu hình tên miền `trungdoan4.io.vn` và API `https://api.trungdoan4.io.vn`
- [x] Cập nhật lại dữ liệu truyền thống, logo và thông tin hiển thị về Trung đoàn 4
- [x] Tạo nhánh `trungdoan4` ở cả FE và BE để lưu trữ và phát triển quy mô Trung đoàn 4
- [x] Trả nhánh chính (`local` / `main`) ở cả FE và BE về cấu hình quy mô Sư đoàn 5

---

## Phases

### Phase 1: Lưu trữ Sư đoàn 5 và khôi phục Trung đoàn 4
**Status:** ✅ Complete
**Objective:** Tạo nhánh lưu trữ `sundoan5`, khôi phục cấu hình tên miền, biến môi trường, logo và dữ liệu truyền thống về quy mô Trung đoàn 4.
**Depends on:** None

**Plans:**
- [x] Plan 1.1: Tạo nhánh lưu trữ và khôi phục cấu hình môi trường, dữ liệu truyền thống Trung đoàn 4

---

### Phase 2: Phân nhánh quy mô Trung đoàn 4 (FE & BE) và khôi phục nhánh chính Sư đoàn 5
**Status:** ✅ Complete
**Objective:** Tạo nhánh `trungdoan4` ở cả FE và BE để phát triển quy mô Trung đoàn 4; khôi phục nhánh chính `local` về cấu hình quy mô Sư đoàn 5.
**Depends on:** Phase 1

**Plans:**
- [x] Plan 2.1: Phân nhánh trungdoan4 ở FE & BE và đưa nhánh chính về Sư đoàn 5

---

### Phase 3: Phân cấp quản lý ý kiến đóng góp theo đơn vị (Tiểu đoàn & Đại đội)
**Status:** ✅ Complete
**Objective:** Bổ sung cấu trúc cây đơn vị (Tiểu đoàn 1/2/3 và các Đại đội trực thuộc Tiểu đoàn/Trung đoàn); phân quyền quản lý và hiển thị danh sách góp ý theo phạm vi đơn vị của cán bộ đăng nhập.
**Depends on:** Phase 2

**Plans:**
- [x] Plan 3.1: Cơ sở dữ liệu và Khởi tạo dữ liệu Đơn vị (Backend)
- [x] Plan 3.2: API Phân quyền theo Đơn vị & Quản lý Tài khoản (Backend)
- [x] Plan 3.3: Giao diện Gửi góp ý & Trang quản lý phân cấp (Frontend)

---

### Phase 4: Khắc phục lỗi hết hạn phiên đăng nhập và tối ưu JWT Token
**Status:** ✅ Complete
**Objective:** Điều chỉnh và tăng thời gian sống của JWT token ở Backend, tối ưu hóa cơ chế xác thực ở Frontend để ngăn chặn việc bị đẩy ra khỏi phiên làm việc đột ngột.
**Depends on:** Phase 3

**Plans:**
- [x] Plan 4.1: Tăng thời gian sống của JWT Token & Kiểm tra phân quyền API

---

### Phase 5: Điều tra và khắc phục triệt để lỗi hết hạn token trên hệ thống
**Status:** ⬜ Not Started
**Objective:** Điều tra nguồn gốc lỗi hết hạn token đang diễn ra trên hệ thống, sửa đổi cơ chế lưu trữ và kiểm tra token của cả frontend và backend để đảm bảo tính ổn định của phiên làm việc.
**Depends on:** Phase 4

**Tasks:**
- [ ] TBD (run /plan 5 to create)

**Verification:**
- TBD

---

## Progress Summary

| Phase | Status | Plans | Complete |
|-------|--------|-------|----------|
| 1 | ✅ | 1/1 | 2026-05-20 |
| 2 | ✅ | 1/1 | 2026-05-20 |
| 3 | ✅ | 3/3 | 2026-05-25 |
| 4 | ✅ | 1/1 | 2026-06-08 |
| 5 | ⬜ | 0/1 | TBD |

---

## Timeline

| Phase | Started | Completed | Duration |
|-------|---------|-----------|----------|
| 1 | 2026-05-20 | 2026-05-20 | < 1h |
| 2 | 2026-05-20 | 2026-05-20 | < 1h |
| 3 | 2026-05-25 | 2026-05-25 | < 1h |
| 4 | 2026-06-08 | 2026-06-08 | < 1h |
| 5 | 2026-06-08 | TBD | TBD |
