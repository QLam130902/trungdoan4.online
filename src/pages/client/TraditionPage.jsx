import React from "react";
import { traditionData } from "../../data/traditionData";
import "./TraditionPage.css";

export default function TraditionPage() {
  return (
    <div className="tradition-page">
      {/* Hero Section */}
      <div className="tradition-hero">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Logo Trung đoàn 4"
          className="tradition-hero-logo"
        />
        <h2 style={{ whiteSpace: 'pre-line' }}>{traditionData.heroTitle}</h2>
        <p className="tradition-division">{traditionData.division}</p>
        <p className="tradition-motto">
          <span className="motto-label">{traditionData.mottoSource}:</span>
          <br />
          "{traditionData.motto}"
        </p>
        <div className="tradition-date">
          <span>📅 Ngày thành lập:</span>
          <strong>{traditionData.foundedDate}</strong>
        </div>
        <div className="tradition-place">
          📍 {traditionData.foundedPlace}
        </div>
      </div>

      {/* Tổng quan */}
      <article className="tradition-card tradition-overview-card">
        <div className="tradition-card-icon">📜</div>
        <h3>Lịch sử hình thành &amp; Quá trình chiến đấu</h3>
        <p>{traditionData.overview}</p>
      </article>

      {/* Thành tích gần đây */}
      <div className="tradition-section-header">
        <span className="section-star">🏆</span>
        <h3>Thành tích gần đây</h3>
      </div>
      <div className="tradition-recent">
        {traditionData.recentAchievements.map((achievement) => (
          <div key={achievement.year} className="tradition-year-card">
            <div className="year-badge">{achievement.year}</div>
            <ul className="achievement-list">
              {achievement.items.map((item, idx) => (
                <li key={idx}>
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

      {/* Tập thể anh hùng */}
      <div className="tradition-subsection-header">
        <span>⭐</span> 04 Tập thể được phong tặng danh hiệu Anh hùng LLVTND
      </div>
      <div className="tradition-heroes-grid">
        {traditionData.heroCollectives.map((collective, idx) => (
          <div key={idx} className="tradition-hero-card collective-card">
            <div className="hero-card-badge">{idx + 1}</div>
            <h4>{collective.name}</h4>
            <p>{collective.detail}</p>
          </div>
        ))}
      </div>

      {/* Cá nhân anh hùng */}
      <div className="tradition-subsection-header">
        <span>⭐</span> 06 Cá nhân được phong tặng danh hiệu Anh hùng LLVTND
      </div>
      <div className="tradition-heroes-grid tradition-heroes-grid--individuals">
        {traditionData.heroIndividuals.map((person, idx) => (
          <div key={idx} className="tradition-hero-card individual-card">
            <div className="hero-card-badge individual-badge">{idx + 1}</div>
            <h4>{person.name}</h4>
            <p className="hero-date">
              Được phong tặng Anh hùng LLVT nhân dân, {person.date}
            </p>
          </div>
        ))}
      </div>

      {/* Phim tài liệu */}
      <a
        href={traditionData.documentaryLink}
        target="_blank"
        rel="noopener noreferrer"
        className="tradition-documentary-link"
      >
        <span className="doc-icon">🎬</span>
        <div className="doc-text">
          <strong>{traditionData.documentaryTitle}</strong>
          <span className="doc-sub">Nhấn để xem trên YouTube ↗</span>
        </div>
      </a>
    </div>
  );
}
