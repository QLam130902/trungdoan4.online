import React, { useState, useEffect } from "react";
import "./ContactMenu.css";

const STORAGE_KEY = "sudoan5_welcome_seen";

export default function ContactMenu() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem(STORAGE_KEY);
    if (!alreadySeen) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShowWelcome(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openWelcomeModal = () => {
    setShowWelcome(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating Action Button (Speed Dial) */}
      <div className={`contact-menu-container ${isMenuOpen ? 'open' : ''}`}>

        {/* Các nút con */}
        <div className="contact-actions">

          {/* Nút 1: Welcome Modal (Top: y = -110, x = 0) */}
          <button
            className="contact-action-btn action-welcome"
            onClick={openWelcomeModal}
            title="Thư chào mừng"
          >
            <span className="action-tooltip">Thư chào mừng</span>
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
          </button>

          {/* Nút 2: Zalo (Angle 30deg: y = -95, x = -55) */}
          <a
            href="https://zalo.me/0989496685"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-action-btn action-zalo"
            title="Zalo"
          >
            <span className="action-tooltip">Zalo</span>
            <img src={`${import.meta.env.BASE_URL}logo-zalo.png`} alt="Zalo" style={{ width: '33px', height: '33px', objectFit: 'cover', borderRadius: '50%' }} />
          </a>

          {/* Nút 3: Messenger (Angle 60deg: y = -55, x = -95) */}
          <a
            href="https://www.messenger.com/t/100006863434895"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-action-btn action-messenger"
            title="Messenger"
          >
            <span className="action-tooltip">Messenger</span>
            <img src={`${import.meta.env.BASE_URL}logo-messenger.png`} alt="Messenger" style={{ width: '33px', height: '33px', objectFit: 'cover', borderRadius: '50%' }} />
          </a>

          {/* Nút 4: Gọi điện (Left: y = 0, x = -110) */}
          <a
            href="tel:0989496685"
            className="contact-action-btn action-phone"
            title="Gọi điện"
          >
            <span className="action-tooltip">Gọi điện</span>
            <img src={`${import.meta.env.BASE_URL}logo-phone.png`} alt="Gọi điện" style={{ width: '33px', height: '33px', objectFit: 'cover', borderRadius: '50%' }} />
          </a>
        </div>

        {/* Nút chính */}
        <button
          className="contact-main-btn"
          onClick={toggleMenu}
          title="Liên hệ / Hỗ trợ"
        >
          {isMenuOpen ? (
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="icon-close">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="icon-phone-shake">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.03 21c.76 0 .98-.66.98-1.21v-3.42c0-.54-.45-.99-.99-.99z" />
            </svg>
          )}
        </button>
      </div>

      {/* Overlay đóng menu khi click ra ngoài */}
      {isMenuOpen && <div className="contact-menu-backdrop" onClick={() => setIsMenuOpen(false)}></div>}


      {/* Modal Welcome (Giữ nguyên cấu trúc cũ) */}
      {showWelcome && (
        <div className="welcome-overlay" onClick={handleCloseWelcome} aria-modal="true" role="dialog" style={{ zIndex: 10000 }}>
          <div className="welcome-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Header cố định */}
            <div className="welcome-header-fixed">
              <img
                src={`${import.meta.env.BASE_URL}logof.png`}
                alt="Logo Sư đoàn 5"
                className="welcome-logo"
              />
              <div>
                <h2 className="welcome-title">Hòm thư góp ý trực tuyến</h2>
                <p className="welcome-unit">Sư đoàn bộ binh 5</p>
              </div>
            </div>

            {/* Nội dung cuộn được */}
            <div className="welcome-scrollable-body">
              <p className="welcome-desc">
                Nhằm mục đích phát huy dân chủ trong toàn đơn vị qua nhiều hình
                thức trực tuyến và trực tiếp, nhóm nghiên cứu của đơn vị đã tiến
                hành phát triển trang web <strong>Hòm thư góp ý Online</strong>.
              </p>

              <div className="welcome-features">
                <h3 className="welcome-features-title">Bạn có thể:</h3>
                <ul className="welcome-feature-list">
                  <li>
                    <span className="feature-icon">💬</span>
                    <span>Phản ánh tình hình sức khỏe, sinh hoạt của chiến sĩ đến Chỉ huy đơn vị</span>
                  </li>
                  <li>
                    <span className="feature-icon">📋</span>
                    <span>Hỏi về chế độ, chính sách trong đơn vị</span>
                  </li>
                  <li>
                    <span className="feature-icon">🏫</span>
                    <span>Góp ý về môi trường công tác, học tập, sinh hoạt</span>
                  </li>
                </ul>
              </div>

              <div className="welcome-guarantee">
                <div className="guarantee-item">
                  <span>🔒</span>
                  <span>Gửi <strong>ẩn danh hoàn toàn</strong> — danh tính được bảo mật</span>
                </div>
                <div className="guarantee-item">
                  <span>📋</span>
                  <span>Nhận <strong>mã tra cứu</strong> để theo dõi tiến độ xử lý</span>
                </div>
              </div>

              <div className="welcome-credit">
                <p>Phát triển bởi:</p>
                <p>
                  <strong>Trung tá Nguyễn Văn Tuấn</strong> – Trưởng Ban Dân vận,
                  Sư đoàn 5
                </p>
                <p>
                  <strong>Trung tá Võ Phước Giàu</strong> – Phó Chủ nhiệm Chính trị,
                  Trung đoàn 4, Sư đoàn 5
                </p>
                <p>
                  <strong>Hạ sỹ Đỗ Quang Lâm</strong> – Chiến sĩ Đại đội 2, Tiểu
                  đoàn 1, Trung đoàn 4, Sư đoàn 5
                </p>
              </div>
            </div>

            {/* Nút đóng cố định */}
            <div className="welcome-footer-fixed">
              <button className="btn-primary" style={{ width: "100%" }} onClick={handleCloseWelcome}>
                Đã hiểu — Bắt đầu gửi góp ý
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
