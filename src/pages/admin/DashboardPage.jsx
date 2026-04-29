import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { getAuthHeaders } = useAuth();
  const [stats, setStats] = useState([
    { label: "Tổng góp ý", value: 0, icon: "📝", color: "red" },
    { label: "Đã xử lý", value: 0, icon: "✅", color: "green" },
    { label: "Chờ tiếp nhận", value: 0, icon: "⏳", color: "gold" },
  ]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/suggestions`, {
      headers: getAuthHeaders()
    })
      .then((res) => res.json())
      .then((data) => {
        const total = data.length;
        const resolved = data.filter((d) => d.status === "RESOLVED").length;
        const pending = data.filter((d) => d.status === "PENDING").length;

        setStats([
          { label: "Tổng góp ý", value: total, icon: "📝", color: "red" },
          { label: "Đã xử lý", value: resolved, icon: "✅", color: "green" },
          { label: "Chờ tiếp nhận", value: pending, icon: "⏳", color: "gold" },
        ]);
      })
      .catch((err) => console.error("Lỗi tải thống kê:", err));
  }, []);

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Tổng quan</h1>
      <p className="dashboard-subtitle">
        Thống kê tình hình tiếp nhận và xử lý góp ý
      </p>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className={`stat-card stat-${stat.color}`}>
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-placeholder card">
        <p>📊 Biểu đồ và báo cáo chi tiết sẽ được cập nhật khi kết nối backend.</p>
      </div>
    </div>
  );
}
