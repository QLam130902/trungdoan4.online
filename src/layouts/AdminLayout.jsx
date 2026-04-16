import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const menuItems = [
  { path: "/admin", label: "Tổng quan", icon: "📊" },
  { path: "/admin/gop-y", label: "Quản lý góp ý", icon: "📋" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src="/logo.png" alt="Logo" className="admin-logo" />
          <div>
            <h2>QUẢN TRỊ</h2>
            <p>Trung đoàn 4</p>
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
        <div className="admin-sidebar-footer">
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
