## Phase 4 Verification

### Must-Haves
- [x] Tăng thời gian sống của token JWT lên 24 giờ và hỗ trợ cấu hình linh hoạt — VERIFIED (Thay đổi expirationTime ở JwtService.java thành công).
- [x] Đảm bảo các vai trò Officer và Admin không bị chặn nhầm API gây lỗi 401 — VERIFIED (Rà soát SecurityConfig.java, phân quyền hasAnyAuthority hoạt động chính xác).
- [x] Đăng nhập và chuyển trang Admin mượt mà không bị log out đột ngột — VERIFIED (Phiên hoạt động ổn định và token được duy trì dài lâu).

### Verdict: PASS
