import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getWeekRange, getMonthRange, getQuarterRange, getCurrentQuarter, toApiDateTime } from '../../utils/exportUtils';
import "./DashboardPage.css";

// Đăng ký các thành phần Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter());
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // Tính khoảng thời gian
  const getRange = () => {
    switch (timeFilter) {
      case 'week': return getWeekRange();
      case 'month': return getMonthRange();
      case 'quarter': return getQuarterRange(selectedQuarter);
      case 'custom': {
        const from = customFrom ? new Date(customFrom + 'T00:00:00') : null;
        const to = customTo ? new Date(customTo + 'T23:59:59') : null;
        return { from, to, label: 'Tùy chọn' };
      }
      case 'all':
      default:
        return { from: null, to: null, label: 'Tất cả' };
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const range = getRange();
      const params = new URLSearchParams();
      if (range.from) params.append('from', toApiDateTime(range.from));
      if (range.to) params.append('to', toApiDateTime(range.to));

      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      try {
        const res = await authFetch(`${apiUrl}/suggestions/stats?${params.toString()}`);
        if (res && res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Lỗi tải thống kê:", err);
      }
    };
    
    fetchStats();
  }, [timeFilter, selectedQuarter, customFrom, customTo, authFetch]);

  // Dữ liệu thẻ thống kê
  const summaryCards = stats ? [
    { label: "Tổng góp ý", value: stats.totalCount, icon: "📝", color: "red" },
    { label: "Đã xử lý", value: stats.resolvedCount, icon: "✅", color: "green" },
    { label: "Chờ tiếp nhận", value: stats.pendingCount, icon: "⏳", color: "gold" },
    { label: "Tỉ lệ xử lý", value: stats.totalCount > 0 ? Math.round((stats.resolvedCount / stats.totalCount) * 100) + "%" : "0%", icon: "📊", color: "sky" },
  ] : [];

  // Dữ liệu biểu đồ cột (Bar Chart)
  const barChartData = stats && stats.dailyBreakdown ? {
    labels: stats.dailyBreakdown.map(d => {
      const parts = d.date.split('-');
      return `${parts[2]}/${parts[1]}`;
    }),
    datasets: [
      {
        label: 'Tổng góp ý',
        data: stats.dailyBreakdown.map(d => d.total),
        backgroundColor: 'rgba(220, 38, 38, 0.7)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Đã xử lý',
        data: stats.dailyBreakdown.map(d => d.resolved),
        backgroundColor: 'rgba(5, 150, 105, 0.7)',
        borderColor: 'rgba(5, 150, 105, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  } : null;

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top', 
        labels: { font: { size: 12, weight: '600' }, boxWidth: 15, padding: 15 } 
      },
      title: { display: false }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { stepSize: 1, font: { size: 11 } },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: { 
        ticks: { font: { size: 11 } },
        grid: { display: false }
      }
    },
    layout: {
      padding: { top: 10, bottom: 10, left: 0, right: 0 }
    }
  };

  // Dữ liệu biểu đồ tròn (Doughnut Chart)
  const doughnutData = stats ? {
    labels: ['Đã xử lý', 'Chưa xử lý'],
    datasets: [{
      data: [stats.resolvedCount, stats.pendingCount],
      backgroundColor: ['rgba(5, 150, 105, 0.85)', 'rgba(234, 179, 8, 0.85)'],
      borderColor: ['#059669', '#ca8a04'],
      borderWidth: 2,
      hoverOffset: 15
    }]
  } : null;

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false, // Để nó lấp đầy container đã được CSS giới hạn
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { font: { size: 12, weight: '600' }, padding: 20, boxWidth: 15 } 
      },
      title: { display: false }
    },
    layout: {
      padding: 25 // Tăng padding để biểu đồ tròn không bị chạm biên khi hover
    },
    cutout: '65%' // Làm cho vòng tròn thanh mảnh hơn, sang trọng hơn
  };

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Tổng quan</h1>
      <p className="dashboard-subtitle">
        Thống kê tình hình tiếp nhận và xử lý góp ý
      </p>

      {/* ===== TOOLBAR LỌC THỜI GIAN ===== */}
      <div className="dashboard-toolbar">
        <div className="time-filter-tabs">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'week', label: 'Tuần này' },
            { id: 'month', label: 'Tháng này' },
            { id: 'quarter', label: 'Theo quý' },
            { id: 'custom', label: 'Tùy chọn' },
          ].map(tab => (
            <button key={tab.id}
              className={`time-filter-btn ${timeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setTimeFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chọn quý */}
        {timeFilter === 'quarter' && (
          <div className="quarter-selector">
            {[1, 2, 3, 4].map(q => (
              <button key={q}
                className={`quarter-chip ${selectedQuarter === q ? 'active' : ''}`}
                onClick={() => setSelectedQuarter(q)}
              >
                Q{q}
              </button>
            ))}
          </div>
        )}

        {/* Chọn ngày tùy chỉnh */}
        {timeFilter === 'custom' && (
          <div className="custom-date-row">
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
            <span>→</span>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} />
          </div>
        )}
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="stats-grid">
        {summaryCards.map((stat) => (
          <div key={stat.label} className={`stat-card stat-${stat.color}`}>
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CHARTS ===== */}
      {stats && stats.dailyBreakdown && stats.dailyBreakdown.length > 0 ? (
        <div className="charts-grid">
          <div className="chart-card chart-bar">
            <div className="chart-container">
              {barChartData && <Bar data={barChartData} options={barOptions} />}
            </div>
          </div>
          <div className="chart-card chart-doughnut">
            <div className="chart-container">
              {doughnutData && <Doughnut data={doughnutData} options={doughnutOptions} />}
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-placeholder card">
          <p>📊 {stats ? 'Chưa có dữ liệu trong khoảng thời gian này.' : 'Đang tải dữ liệu...'}</p>
        </div>
      )}
    </div>
  );
}
