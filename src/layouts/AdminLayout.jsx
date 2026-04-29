import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AdminLayout.css";

const baseMenuItems = [
  { path: "/admin", label: "Tổng quan", icon: "📊" },
  { path: "/admin/gop-y", label: "Quản lý góp ý", icon: "📋" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Render menu động theo Role
  const menuItems = [...baseMenuItems];
  if (user && user.role === 'ROLE_ADMIN') {
    menuItems.push({ path: "/admin/can-bo", label: "Quản lý Cán bộ", icon: "👥" });
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-sidebar-header">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="admin-logo" />
            <div className="admin-title-wrap">
              <h2>QUẢN TRỊ</h2>
              <p>Trung đoàn 4</p>
            </div>
          </div>
          
          <div className="admin-mobile-user">
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--gray-700)' }}>
                  <strong>{user.fullName}</strong>
                </div>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="Đăng xuất">
                  🚪
                </button>
              </div>
            )}
          </div>
        </div>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer desktop-only">
          {user && (
            <div style={{ marginBottom: '15px', padding: '0 8px', color: 'var(--gray-600)', fontSize: '13px' }}>
              <div>👤 <strong>{user.fullName}</strong></div>
              <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--gray-400)' }}>{user.role === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Cán bộ xử lý'}</div>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="btn-secondary"
            style={{ width: '100%', marginBottom: '12px' }}
          >
            Đăng xuất
          </button>

          <Link to="/" className="admin-back-link">
            ← Về trang chính
          </Link>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
