import React, { useState, useEffect } from "react";
import "./WelcomeModal.css";

const STORAGE_KEY = "trungdoan4_welcome_seen";

export default function WelcomeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem(STORAGE_KEY);
    if (!alreadySeen) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  if (!show) {
    return (
      <button
        className="welcome-bubble-btn"
        onClick={() => setShow(true)}
        title="Giới thiệu về hòm thư góp ý"
        aria-label="Xem giới thiệu"
      >
        ?
      </button>
    );
  }

  return (
    <>
      {/* Nút bong bóng vẫn hiện khi modal đang mở */}
      <button
        className="welcome-bubble-btn"
        onClick={() => setShow(true)}
        title="Giới thiệu về hòm thư góp ý"
        aria-label="Xem giới thiệu"
        style={{ opacity: 0.4, pointerEvents: "none" }}
      >
        ?
      </button>

      {/* Overlay */}
      <div className="welcome-overlay" onClick={handleClose} aria-modal="true" role="dialog">
        <div className="welcome-dialog" onClick={(e) => e.stopPropagation()}>

          {/* Header cố định — không cuộn */}
          <div className="welcome-header-fixed">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Logo Trung đoàn 4"
              className="welcome-logo"
            />
            <div>
              <h2 className="welcome-title">Hòm thư góp ý trực tuyến</h2>
              <p className="welcome-unit">Trung đoàn 4 – Sư đoàn 5</p>
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
                <strong>Hạ sỹ Đỗ Quang Lâm</strong> – Chiến sĩ Đại đội 2, Tiểu
                đoàn 1, Trung đoàn 4, Sư đoàn 5
              </p>
            </div>
          </div>

          {/* Nút đóng cố định — không cuộn */}
          <div className="welcome-footer-fixed">
            <button className="btn-primary" style={{ width: "100%" }} onClick={handleClose}>
              Đã hiểu — Bắt đầu gửi góp ý
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
