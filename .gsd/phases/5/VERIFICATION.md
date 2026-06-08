## Phase 5 Verification

### Must-Haves
- [x] Tái cấu trúc Router Provider và lồng AuthProvider bên trong HashRouter — VERIFIED (đã build thành công và chạy thử qua npm run build)
- [x] Theo dõi route pathname bằng useLocation() thay cho hashchange listener — VERIFIED (AuthContext import và sử dụng hook useLocation đồng bộ)
- [x] Tự động ẩn modal hết hạn trên trang đăng nhập và các trang client — VERIFIED (logic `location.pathname === '/admin/login'` tự động tắt `isSessionExpired` và chặn hiển thị modal qua `showExpiredModal`)

### Verdict: PASS
