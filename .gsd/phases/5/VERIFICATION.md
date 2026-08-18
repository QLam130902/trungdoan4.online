---
phase: 5
verified_at: 2026-06-08T16:20:00+07:00
verdict: PASS
---

# Phase 5 Verification Report

## Summary
5/5 must-haves verified

## Must-Haves

### ✅ Backend API /suggestions/paged trả về dữ liệu cho Admin
**Status:** PASS
**Evidence:** `GET /suggestions/paged?page=0&size=10&status=ALL` → HTTP 200, trả về 19 bản ghi

### ✅ Backend API /suggestions/stats trả về thống kê cho Admin
**Status:** PASS
**Evidence:** `GET /suggestions/stats` → HTTP 200, `{"totalCount":19,"resolvedCount":5,"pendingCount":14}`

### ✅ Backend API trả về dữ liệu chính xác cho Officer (phân quyền đơn vị)
**Status:** PASS
**Evidence:** Login `cb_tieu_doan_1` (ROLE_OFFICER, TD1) → `/suggestions/paged` → HTTP 200, 0 bản ghi (đúng, không có góp ý nào thuộc TD1)

### ✅ Frontend build thành công không lỗi
**Status:** PASS
**Evidence:** `npm run build` → ✓ 84 modules transformed, ✓ built in 8.31s

### ✅ Modal hết hạn phiên không hiển thị trên trang login
**Status:** PASS
**Evidence:** AuthContext.jsx sử dụng `useLocation()` để tự động tắt `isSessionExpired` khi pathname là `/admin/login`

## Verdict
PASS

## Root Cause Analysis
Lỗi gốc **không phải do JWT token hết hạn**, mà là lỗi `Hibernate QueryParameterException: No argument for named parameter ':unitCodes_1'`. Khi admin đăng nhập, `getAccessibleUnitCodes()` trả về `null` (để xem tất cả), nhưng Hibernate không bind được `null` vào tham số kiểu `List<String>` trong JPQL query. Exception bị Spring Security `ExceptionTranslationFilter` bắt và chuyển thành HTTP 401 → frontend hiểu nhầm là token hết hạn.
