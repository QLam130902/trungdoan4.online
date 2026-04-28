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
      setIsCopied(false);

      // Tự động copy vào clipboard
      try {
        await navigator.clipboard.writeText(code);
        setIsCopied(true);
      } catch (err) {
        console.error("Không thể copy tự động", err);
      }
      // (Tạm thời không cập nhật records ảo nữa mà nên có phần gọi api GET để tra cứu sau)

      // Xóa trắng form
      setFeedback("");
      setSenderName("");
      setSelectedOfficer("");
      setIsAnonymous(true);
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
                  placeholder="Ví dụ: GY-AB12CD"
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
              try {
                await navigator.clipboard.writeText(submittedCode);
                setIsCopied(true);
              } catch (e) {
                console.error("Copy failed", e);
              }
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
          {isCopied ? <span style={{color: '#4CAF50', fontWeight: 'bold'}}>Mã tra cứu đã được tự động sao chép! </span> : ""}
          Lưu mã này để tra cứu trạng thái xử lý tại tab "Tra cứu trạng thái".
        </p>
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
