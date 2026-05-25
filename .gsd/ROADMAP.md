---
milestone: Chuyển đổi Quy mô Dự án
version: 1.2.0
updated: 2026-05-25T15:58:00+07:00
---

# Roadmap

> **Current Phase:** Phase 3: Phân cấp quản lý góp ý theo đơn vị
> **Status:** in_progress

## Must-Haves (from SPEC)

- [x] Lưu trữ phiên bản Sư đoàn 5 hiện tại sang nhánh `sundoan5`
- [x] Khôi phục cấu hình tên miền `trungdoan4.io.vn` và API `https://api.trungdoan4.io.vn`
- [x] Cập nhật lại dữ liệu truyền thống, logo và thông tin hiển thị về Trung đoàn 4
- [x] Tạo nhánh `trungdoan4` ở cả FE và BE để lưu trữ và phát triển quy mô Trung đoàn 4
- [x] Trả nhánh chính (`local` / `main`) ở cả FE và BE về cấu hình quy mô Sư đoàn 5
- [ ] Phân cấp quản lý góp ý theo đơn vị (Trung đoàn, Tiểu đoàn, Đại đội)

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

### Phase 3: Phân cấp quản lý góp ý theo đơn vị (Trung đoàn, Tiểu đoàn, Đại đội)
**Status:** ⬜ Not Started
**Objective:** Xây dựng tính năng phân cấp đơn vị cho Trung đoàn 4. Người dùng chọn đơn vị khi gửi góp ý. Phân quyền hiển thị góp ý cho cán bộ dựa trên cấp bậc quản lý (Đại đội chỉ xem Đại đội mình; Tiểu đoàn xem các Đại đội trực thuộc; Trung đoàn xem tất cả).
**Depends on:** Phase 2

**Tasks:**
- [ ] TBD (chạy /plan 3 để khởi tạo kế hoạch chi tiết)

**Verification:**
- TBD

---

## Progress Summary

| Phase | Status | Plans | Complete |
|-------|--------|-------|----------|
| 1     | ✅      | 1/1   | 2026-05-20 |
| 2     | ✅      | 1/1   | 2026-05-20 |
| 3     | ⬜      | 0/1   | TBD        |

---

## Timeline

| Phase | Started | Completed | Duration |
|-------|---------|-----------|----------|
| 1     | 2026-05-20 | 2026-05-20 | < 1h |
| 2     | 2026-05-20 | 2026-05-20 | < 1h |
| 3     | 2026-05-25 | TBD       | TBD      |

