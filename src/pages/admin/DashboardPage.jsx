import React from "react";
import "./DashboardPage.css";

export default function DashboardPage() {
  // Mock data
  const stats = [
    { label: "Tổng góp ý", value: 128, icon: "📝", color: "red" },
    { label: "Đã xử lý", value: 95, icon: "✅", color: "green" },
    { label: "Đang xử lý", value: 23, icon: "⏳", color: "gold" },
    { label: "Chờ tiếp nhận", value: 10, icon: "📥", color: "sky" },
  ];

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
