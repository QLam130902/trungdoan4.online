import React, { useState } from "react";
import TabToggle from "../../components/TabToggle";
import Modal from "../../components/Modal";
import { officers } from "../../data/officers";
import { createFeedbackCode } from "../../utils/helpers";
import "./FeedbackPage.css";

const feedbackTabs = [
  { value: "submit", label: "Gửi góp ý", icon: "📝" },
  { value: "lookup", label: "Tra cứu trạng thái", icon: "🔍" },
];

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState("submit");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [senderName, setSenderName] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State quản lý loading khi gọi API POST
  const [isLookupLoading, setIsLookupLoading] = useState(false); // State loading cho API GET Lookup
  const [lookupCode, setLookupCode] = useState("");
  const [lookupResult, setLookupResult] = useState(null); // Thay đổi thành null vì kết quả nhận về là Object
  const [lookupError, setLookupError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [wantsContact, setWantsContact] = useState(false); // Muốn được liên lạc qua SĐT
  const [contactPhone, setContactPhone] = useState(""); // SĐT người gửi
  const [handlerPhone, setHandlerPhone] = useState(""); // SĐT cán bộ sẽ liên lạc lại

  // Hàm hỗ trợ copy vào clipboard (có fallback cho trình duyệt cũ/không an toàn)
  const copyToClipboard = async (text) => {
    if (!text) return false;

    // Cách 1: Clipboard API (hiện đại, yêu cầu HTTPS/localhost)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error("Clipboard API failed:", err);
      }
    }

    // Cách 2: Fallback dùng textarea (cho HTTP hoặc trình duyệt cũ)
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Tránh làm nhảy màn hình
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error("Fallback copy failed:", err);
      return false;
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!feedback.trim()) {
      setError("Vui lòng nhập nội dung góp ý.");
      return;
    }

    if (!isAnonymous && !senderName.trim()) {
      setError("Vui lòng nhập tên người gửi hoặc chọn ẩn danh.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Chuẩn bị dữ liệu gửi lên API Backend
      const payload = {
        body: feedback,
        suggestedBy: isAnonymous ? "Ẩn danh" : senderName,
        handledBy: selectedOfficer || null,
        contactPhone: (!isAnonymous && wantsContact && contactPhone.length === 10) ? contactPhone : null,
      };

      // 2. Giao tiếp với API Backend qua fetch
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi gọi API, vui lòng kiểm tra server Backend!");
      }

      const data = await response.json();

      // 3. Lấy trackingCode do Backend cung cấp thay vì random frontend
      const code = data.trackingCode;
      setSubmittedCode(code);
      setHandlerPhone(data.handlerPhone || ""); // Lưu SĐT cán bộ
      setIsCopied(false);

      // Tự động copy vào clipboard
      const success = await copyToClipboard(code);
      setIsCopied(success);
      // (Tạm thời không cập nhật records ảo nữa mà nên có phần gọi api GET để tra cứu sau)

      // Xóa trắng form
      setFeedback("");
      setSenderName("");
      setSelectedOfficer("");
      setIsAnonymous(true);
      setWantsContact(false);
      setContactPhone("");
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookup = async (event) => {
    event.preventDefault();
    setLookupError("");
    setLookupResult(null);

    const code = lookupCode.trim().toUpperCase();
    if (!code) {
      setLookupError("Vui lòng nhập mã góp ý để tra cứu.");
      return;
    }

    setIsLookupLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/suggestions/lookup/${code}`);

      if (response.status === 404) {
        throw new Error("Không tìm thấy mã góp ý. Vui lòng kiểm tra lại.");
      }

      if (!response.ok) {
        throw new Error("Lỗi kết nối tới Backend!");
      }

      const data = await response.json();
      setLookupResult(data);
    } catch (err) {
      setLookupError(err.message || "Đã xảy ra lỗi hệ thống.");
    } finally {
      setIsLookupLoading(false);
    }
  };

  return (
    <div className="feedback-page">
      <TabToggle
        tabs={feedbackTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="panels-wrapper">
        {/* ===== Panel: Gửi góp ý ===== */}
        <div className={`panel ${activeTab === "submit" ? "visible" : ""}`}>
          <div className="card">
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Hình thức gửi</label>
                <div className="identity-toggle">
                  <button
                    type="button"
                    className={`identity-option ${isAnonymous ? "active" : ""}`}
                    onClick={() => setIsAnonymous(true)}
                  >
                    🔒 Ẩn danh
                  </button>
                  <button
                    type="button"
                    className={`identity-option ${!isAnonymous ? "active" : ""}`}
                    onClick={() => setIsAnonymous(false)}
                  >
                    👤 Công khai
                  </button>
                </div>
              </div>

              <div className={`sender-slide ${!isAnonymous ? "visible" : ""}`}>
                <div className="field">
                  <label className="label" htmlFor="senderName">
                    Họ tên người gửi <span className="required-star">*</span>
                  </label>
                  <input
                    id="senderName"
                    className="input"
                    type="text"
                    placeholder="Nhập họ tên..."
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </div>
              </div>

              {/* Tính năng SĐT liên hệ: chỉ hiện khi gửi công khai */}
              {!isAnonymous && (
                <div className="contact-phone-section">
                  <label className="contact-checkbox-label">
                    <input
                      type="checkbox"
                      checked={wantsContact}
                      onChange={(e) => setWantsContact(e.target.checked)}
                    />
                    <span>Tôi muốn được đơn vị liên hệ qua điện thoại</span>
                  </label>
                  {wantsContact && (
                    <input
                      className="input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="Nhập số điện thoại (10 số)..."
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ""))}
                    />
                  )}
                </div>
              )}

              <div className="field" style={{ display: "none" }}>
                <label className="label" htmlFor="officer">
                  Cán bộ xử lý
                  <span className="optional-tag">không bắt buộc</span>
                </label>
                <select
                  id="officer"
                  className="input"
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                >
                  <option value="">
                    -- Gửi đến đơn vị (không chọn cán bộ) --
                  </option>
                  {officers.map((officer) => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name} — {officer.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="label" htmlFor="feedbackContent">
                  Nội dung góp ý <span className="required-star">*</span>
                </label>
                <textarea
                  id="feedbackContent"
                  className="input textarea"
                  placeholder="Trình bày nội dung góp ý..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              {error && (
                <div className="error-msg">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Đang gửi..." : "Gửi góp ý"}
              </button>
            </form>
          </div>
        </div>

        {/* ===== Panel: Tra cứu ===== */}
        <div className={`panel ${activeTab === "lookup" ? "visible" : ""}`}>
          <div className="card">
            <div className="lookup-intro">
              <p>
                Nhập mã góp ý bạn đã nhận được sau khi gửi để kiểm tra trạng
                thái xử lý.
              </p>
            </div>

            <form className="form" onSubmit={handleLookup}>
              <div className="field">
                <label className="label" htmlFor="lookupCode">
                  Mã góp ý
                </label>
                <input
                  id="lookupCode"
                  className="input"
                  type="text"
                  placeholder="Ví dụ: 300426A"
                  value={lookupCode}
                  onChange={(e) => setLookupCode(e.target.value)}
                />
              </div>

              {lookupError && (
                <div className="error-msg">
                  <span>⚠️</span> {lookupError}
                </div>
              )}

              {lookupResult && (
                <div className="status-result">
                  <div className="status-header">
                    <span>✅</span>
                    <span>
                      Trạng thái: <strong>{lookupResult.status === "PENDING" ? "Đang chờ xử lý" : (lookupResult.status === "RESOLVED" ? "Đã phản hồi và hoàn tất" : lookupResult.status)}</strong>
                    </span>
                  </div>

                  {lookupResult.status === "RESOLVED" && lookupResult.response && (
                    <div className="response-box" style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f9f9f9", borderLeft: "4px solid #4CAF50", borderRadius: "4px" }}>
                      <strong>Kết quả xử lý / Phản hồi:</strong>
                      <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>{lookupResult.response}</p>
                    </div>
                  )}
                </div>
              )}

              <button type="submit" className="btn-secondary" disabled={isLookupLoading}>
                {isLookupLoading ? "Đang tra cứu..." : "Tra cứu"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={!!submittedCode} onClose={() => setSubmittedCode("")}>
        <div className="modal-icon">✓</div>
        <h2>Góp ý đã được ghi nhận</h2>
        <div className="modal-code-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '15px 0' }}>
          <div className="modal-code" style={{ margin: 0 }}>{submittedCode}</div>
          <button
            type="button"
            onClick={async () => {
              const success = await copyToClipboard(submittedCode);
              if (success) setIsCopied(true);
            }}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: isCopied ? '#4CAF50' : '#e0e0e0',
              color: isCopied ? 'white' : '#333',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            {isCopied ? "✓ Đã copy" : "📋 Copy"}
          </button>
        </div>
        <p className="modal-hint">
          {isCopied ? <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Mã tra cứu đã được tự động sao chép! </span> : ""}
          Lưu mã này để tra cứu trạng thái xử lý tại tab "Tra cứu trạng thái".
        </p>
        {handlerPhone && (
          <div className="modal-contact-info">
            <span>📞</span>
            <span>
              Bạn sẽ nhận được liên lạc từ số: <strong>{handlerPhone}</strong> –
              Trung tá Nguyễn Văn Tuấn – Trưởng Ban Dân vận, Sư đoàn 5 trong thời gian sớm nhất.
            </span>
          </div>
        )}
        <button
          type="button"
          className="btn-primary"
          onClick={() => setSubmittedCode("")}
        >
          Đã hiểu
        </button>
      </Modal>
    </div>
  );
}
