import React, { useState, useEffect } from "react";
import "./ContactMenu.css";

const STORAGE_KEY = "sudoan5_welcome_seen";

export default function ContactMenu() {
  const [showWelcome, setShowWelcome] = useState(false);

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

  const openWelcomeModal = () => {
    setShowWelcome(true);
  };

  return (
    <>
      {/* Nút Liên hệ / Hỗ trợ trên màn hình chính */}
      <div className="contact-menu-container">
        <button
          className="contact-main-btn"
          onClick={openWelcomeModal}
          title="Liên hệ / Hỗ trợ"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="icon-phone-shake">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.03 21c.76 0 .98-.66.98-1.21v-3.42c0-.54-.45-.99-.99-.99z" />
          </svg>
        </button>
      </div>

      {/* Modal Welcome */}
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
                <div className="welcome-action-list">
                  <a
                    href="https://zalo.me/0989496685"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="welcome-action-item"
                  >
                    <span className="welcome-action-icon">
                      <img src={`${import.meta.env.BASE_URL}logo-zalo.png`} alt="Zalo" />
                    </span>
                    <span className="welcome-action-label">Liên hệ qua Zalo</span>
                  </a>

                  <a
                    href="https://www.messenger.com/t/100006863434895"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="welcome-action-item"
                  >
                    <span className="welcome-action-icon">
                      <img src={`${import.meta.env.BASE_URL}logo-messenger.png`} alt="Messenger" />
                    </span>
                    <span className="welcome-action-label">Liên hệ qua Messenger</span>
                  </a>

                  <a
                    href="tel:0989496685"
                    className="welcome-action-item"
                  >
                    <span className="welcome-action-icon">
                      <img src={`${import.meta.env.BASE_URL}logo-phone.png`} alt="Số điện thoại" />
                    </span>
                    <span className="welcome-action-label">Liên hệ qua số điện thoại</span>
                  </a>

                  <button
                    type="button"
                    className="welcome-action-item"
                    onClick={handleCloseWelcome}
                  >
                    <span className="welcome-action-icon welcome-action-icon-direct">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                      </svg>
                    </span>
                    <span className="welcome-action-label">Gửi góp ý trực tiếp</span>
                  </button>
                </div>
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
