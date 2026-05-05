import React from "react";
import { traditionData } from "../../data/traditionData";
import "./TraditionPage.css";

export default function TraditionPage() {
  return (
    <div className="tradition-page">
      {/* Hero Section */}
      <div className="tradition-hero">
        <img
          src={`${import.meta.env.BASE_URL}logof.png`}
          alt="Logo Sư đoàn 5"
          className="tradition-hero-logo"
        />
        <h2 style={{ whiteSpace: 'pre-line' }}>{traditionData.heroTitle}</h2>
        <p className="tradition-division">{traditionData.division}</p>
        <p className="tradition-motto">
          <span className="motto-label">{traditionData.mottoSource}:</span>
          <br />
          "{traditionData.motto}"
        </p>
        <div className="tradition-dates">
          <div className="tradition-date tradition-date--sub">
            <span>📅 Ngày thành lập:</span>
            <strong>{traditionData.foundedDate}</strong>
          </div>
          <div className="tradition-place" style={{ marginBottom: '8px' }}>
            📍 {traditionData.foundedPlace}
          </div>
          <div className="tradition-date tradition-date--main">
            <span>⭐ Ngày truyền thống:</span>
            <strong>{traditionData.traditionalDate}</strong>
          </div>
        </div>
      </div>

      {/* Tổng quan */}
      <article className="tradition-card tradition-overview-card">
        <div className="tradition-card-icon">📜</div>
        <h3>Lịch sử hình thành &amp; Quá trình chiến đấu</h3>
        <p>{traditionData.overview}</p>
      </article>

      {/* Những trận đánh tiêu biểu */}
      <div className="tradition-section-header">
        <span className="section-star">⚔️</span>
        <h3>Những trận đánh tiêu biểu</h3>
      </div>
      <div className="tradition-recent">
        {traditionData.battles.map((battle, idx) => (
          <div key={idx} className="tradition-period-card">
            <div className="period-badge">{battle.period}</div>
            <ul className="achievement-list">
              {battle.items.map((item, i) => (
                <li key={i}>
                  <span className="achievement-bullet">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Thành tích gần đây */}
      <div className="tradition-section-header" style={{ marginTop: '30px' }}>
        <span className="section-star">🏆</span>
        <h3>Thành tích gần đây</h3>
      </div>
      <div className="tradition-recent">
        {traditionData.recentAchievements.map((achievement, idx) => (
          <div key={idx} className="tradition-period-card">
            <div className="period-badge">{achievement.year}</div>
            <ul className="achievement-list">
              {achievement.items.map((item, i) => (
                <li key={i}>
                  <span className="achievement-bullet">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Thành tích tiêu biểu */}
      <div className="tradition-section-header tradition-section-header--gold">
        <span className="section-star">⭐⭐⭐</span>
        <h3>NHỮNG THÀNH TÍCH TIÊU BIỂU</h3>
        <span className="section-star">⭐⭐⭐</span>
      </div>

      {/* Huân chương & Phần thưởng */}
      <div className="tradition-card" style={{ marginBottom: '20px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {traditionData.heroAwards.map((award, idx) => (
            <li key={idx} style={{ marginBottom: '10px', paddingLeft: '24px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--gold-500)' }}>⭐</span>
              <strong style={{ color: 'var(--gray-800)' }}>{award}</strong>
            </li>
          ))}
        </ul>
      </div>

      {/* Thống kê anh hùng */}
      <div className="tradition-heroes-grid">
        {traditionData.heroStats.map((stat, idx) => (
          <div key={idx} className="tradition-hero-card collective-card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--red-600)', marginBottom: '10px' }}>{stat.value}</div>
            <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--gray-700)' }}>{stat.label}</h4>
          </div>
        ))}
      </div>

      {/* Phim tài liệu */}
      <div className="tradition-section-header" style={{ marginTop: '40px' }}>
        <span className="section-star">🎬</span>
        <h3>Phim tài liệu Sư đoàn 5</h3>
      </div>
      <div className="documentary-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {traditionData.documentaries.map((doc, idx) => (
          <div key={idx} className="tradition-card" style={{ padding: '15px' }}>
            <h4 style={{ color: 'var(--red-600)', marginBottom: '10px', fontSize: '18px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '8px' }}>
              {doc.title}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
              {doc.parts.map((part, pIdx) => (
                <a
                  key={pIdx}
                  href={part.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tradition-documentary-link"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '6px', textDecoration: 'none', color: 'var(--gray-800)', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red-50)'; e.currentTarget.style.borderColor = 'var(--red-300)'; e.currentTarget.style.color = 'var(--red-700)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-800)'; }}
                >
                  <span style={{ color: 'var(--red-600)' }}>▶</span> {part.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
