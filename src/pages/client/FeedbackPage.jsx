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
  const [records, setRecords] = useState({});
  const [lookupCode, setLookupCode] = useState("");
  const [lookupResult, setLookupResult] = useState("");
  const [lookupError, setLookupError] = useState("");

  const handleSubmit = (event) => {
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

    const newCode = createFeedbackCode();
    const statuses = [
      "Đã tiếp nhận",
      "Đang xử lý",
      "Đã phản hồi và hoàn tất",
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    setSubmittedCode(newCode);
    setRecords((prev) => ({
      ...prev,
      [newCode]: randomStatus,
    }));

    setFeedback("");
    setSenderName("");
    setSelectedOfficer("");
    setIsAnonymous(true);
  };

  const handleLookup = (event) => {
    event.preventDefault();
    setLookupError("");
    setLookupResult("");

    const code = lookupCode.trim().toUpperCase();
    if (!code) {
      setLookupError("Vui lòng nhập mã góp ý để tra cứu.");
      return;
    }

    if (!records[code]) {
      setLookupError("Không tìm thấy mã góp ý. Vui lòng kiểm tra lại.");
      return;
    }

    setLookupResult(records[code]);
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

              <div className="field">
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

              <button type="submit" className="btn-primary">
                Gửi góp ý
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
                  <span>✅</span>
                  <span>
                    Trạng thái: <strong>{lookupResult}</strong>
                  </span>
                </div>
              )}

              <button type="submit" className="btn-secondary">
                Tra cứu
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={!!submittedCode} onClose={() => setSubmittedCode("")}>
        <div className="modal-icon">✓</div>
        <h2>Góp ý đã được ghi nhận</h2>
        <div className="modal-code">{submittedCode}</div>
        <p className="modal-hint">
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
