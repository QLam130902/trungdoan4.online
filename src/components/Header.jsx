import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Hòm thư góp ý", icon: "📝" },
    { path: "/truyen-thong", label: "Truyền thống đơn vị", icon: "⭐" },
    { path: "/faq", label: "Hỏi đáp", icon: "❓" },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        <img
          src="/logof.png"
          alt="Logo đơn vị"
          className="header-logo header-logo-left"
        />
        <div className="header-text">
          <h1>HÒM THƯ GÓP Ý TRỰC TUYẾN</h1>
          <p>TRUNG ĐOÀN BB4 — SƯ ĐOÀN BB5</p>
        </div>
        <img
          src="/logo.png"
          alt="Logo Trung đoàn 4 - Sư đoàn 5"
          className="header-logo header-logo-right"
        />
      </div>
      <div className="header-bar" />
      <nav className="nav-bar">
        <div className="nav-inner">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
