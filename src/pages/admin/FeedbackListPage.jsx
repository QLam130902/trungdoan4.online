import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { useAuth } from "../../contexts/AuthContext";
import "./FeedbackListPage.css";

export default function FeedbackListPage() {
  const { getAuthHeaders } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyModalData, setReplyModalData] = useState(null); // Góp ý đang được chọn để phản hồi
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, PENDING, RESOLVED

  // 1. Lấy dữ liệu thực từ API
  const fetchFeedbacks = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/suggestions`, {
      headers: getAuthHeaders()
    })
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => console.error("Lỗi khi tải danh sách góp ý", err));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // 2. Api thao tác: Xóa mềm
  const deleteFeedback = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa góp ý này? Sự kiện gọi Soft Delete ở Backend.")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/suggestions/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders()
        });
        if (res.ok) {
          fetchFeedbacks(); // Tải lại danh sách
        } else {
          alert("Lỗi khi kết nối với máy chủ!");
        }
      } catch (err) {
        alert("Lỗi hệ thống.");
      }
    }
  };

  // Mở Popup
  const openReplyModal = (fb) => {
    setReplyModalData(fb);
    setReplyText(fb.response || "");
  };

  // 3. Xử lý lưu phản hồi
  const submitReply = async () => {
    if (!replyText.trim()) {
      alert("Vui lòng nhập nội dung phản hồi.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/suggestions/${replyModalData.id}/reply`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ response: replyText }),
      });
      if (res.ok) {
        setReplyModalData(null);
        fetchFeedbacks(); // Cập nhật danh sách với trạng thái mới
      } else {
        alert("Lỗi khi lưu phản hồi!");
      }
    } catch (err) {
      alert("Lỗi hệ thống.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "PENDING") return "status-progress";
    if (status === "RESOLVED") return "status-done";
    return "";
  };

  const formatDateShort = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} ${hours}:${mins}`;
  };

  const filteredFeedbacks = feedbacks.filter(fb => {
    if (filterStatus === "ALL") return true;
    return fb.status === filterStatus;
  });

  return (
    <div className="feedback-list-page">
      <h1 className="page-title">Quản lý góp ý</h1>
      <div className="admin-actions-bar">
        <p className="page-subtitle" style={{ margin: 0 }}>
          {filteredFeedbacks.length} góp ý được hiển thị
        </p>
        
        <div className="status-filter-tabs">
          <button 
            className={`filter-tab ${filterStatus === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterStatus('ALL')}
          >
            Tất cả
          </button>
          <button 
            className={`filter-tab ${filterStatus === 'PENDING' ? 'active' : ''}`}
            onClick={() => setFilterStatus('PENDING')}
          >
            Chưa xử lý
          </button>
          <button 
            className={`filter-tab ${filterStatus === 'RESOLVED' ? 'active' : ''}`}
            onClick={() => setFilterStatus('RESOLVED')}
          >
            Đã xử lý
          </button>
        </div>
      </div>

      {/* ===== DESKTOP TABLE ===== */}
      <div className="feedback-table-wrapper desktop-only">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày nộp</th>
              <th>Người gửi</th>
              <th style={{ width: "100%" }}>Nội dung</th>
              <th>Trạng thái</th>
              <th style={{ whiteSpace: "nowrap", minWidth: "220px", textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map((fb) => (
              <tr key={fb.id}>
                <td className="td-code" title={fb.trackingCode}>{fb.id}</td>
                <td className="td-date">{formatDateShort(fb.suggestAt)}</td>
                <td style={{ whiteSpace: "nowrap" }}>{fb.suggestedBy || "Ẩn danh"}</td>
                <td className="td-content">{fb.body}</td>
                <td>
                  {fb.status === 'PENDING' ? (
                    <span className="status-badge status-pending">Chưa xử lý</span>
                  ) : (
                    <span className="status-badge status-resolved">Đã xử lý ({fb.handledBy})</span>
                  )}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                    <button onClick={() => openReplyModal(fb)} style={{ padding: "6px 12px", backgroundColor: "var(--success)", color: "white", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: "bold", fontSize: "12px", whiteSpace: "nowrap" }}>
                      {fb.status === 'RESOLVED' ? '✎ Chỉnh sửa' : '✎ Phản hồi'}
                    </button>
                    <button onClick={() => deleteFeedback(fb.id)} style={{ padding: "6px 12px", backgroundColor: "var(--danger)", color: "white", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: "bold", fontSize: "12px", whiteSpace: "nowrap" }}>
                      ✖ Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARD LIST ===== */}
      <div className="feedback-card-list mobile-only">
        {filteredFeedbacks.map((fb) => (
          <div key={fb.id} className="feedback-card compact">
            <div className="feedback-card-top">
              <span className="feedback-card-id">#{fb.id}</span>
              {fb.status === 'PENDING' ? (
                <span className="status-badge status-pending small">Chưa xử lý</span>
              ) : (
                <span className="status-badge status-resolved small">Đã xử lý</span>
              )}
            </div>
            
            <div className="feedback-card-main">
              <div className="feedback-card-body-wrap">
                <span className="icon-wrap">💬</span>
                <p className="feedback-card-body">{fb.body}</p>
              </div>
            </div>

            <div className="feedback-card-info-row">
              <div className="info-item">
                <span className="icon-wrap">👤</span> {fb.suggestedBy || "Ẩn danh"}
              </div>
              <div className="info-item">
                <span className="icon-wrap">🕒</span> {formatDateShort(fb.suggestAt)}
              </div>
            </div>
            
            <div className="feedback-card-footer-compact">
              <button onClick={() => openReplyModal(fb)} className="feedback-card-action-btn-compact">
                {fb.status === 'RESOLVED' ? '✎ Chỉnh sửa' : '✎ Phản hồi'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFeedbacks.length === 0 && (
        <div className="empty-state card">
          <p>Chưa có góp ý nào.</p>
        </div>
      )}

      {/* Hiển thị Popup Modal Chi tiết và Nhập câu trả lời */}
      <Modal show={!!replyModalData} onClose={() => setReplyModalData(null)}>
        <h2 style={{ marginBottom: "15px", color: "var(--red-600)" }}>
          {replyModalData?.status === 'RESOLVED' ? `Chỉnh sửa phản hồi #${replyModalData?.id}` : `Chi tiết góp ý #${replyModalData?.id}`}
        </h2>
        {replyModalData && (
          <div style={{ textAlign: "left", fontSize: "14px", lineHeight: "1.6" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div><strong>Người gửi:</strong> <br />{replyModalData.suggestedBy || "Ẩn danh"}</div>
              <div><strong>Ngày gửi:</strong> <br />{new Date(replyModalData.suggestAt).toLocaleString('vi-VN')}</div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Trạng thái:</strong> <br />
                {replyModalData.status === 'PENDING' ? (
                  <span className="status-select status-progress" style={{ display: 'inline-block', marginTop: '4px' }}>Chưa xử lý</span>
                ) : (
                  <span className="status-select status-done" style={{ display: 'inline-block', marginTop: '4px' }}>Đã xử lý bởi {replyModalData.handledBy || "Ẩn danh"}</span>
                )}
              </div>
            </div>

            <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
              <strong>Nội dung góp ý:</strong>
              <p style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{replyModalData.body}</p>
            </div>

            <div style={{ marginTop: "15px", marginBottom: "20px" }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                Phản hồi / Hướng giải quyết:
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ width: "100%", height: "100px", padding: "12px", borderRadius: "6px", border: "1px solid var(--gray-300)", fontFamily: "inherit" }}
                placeholder="Nhập nội dung giải quyết (nếu có)..."
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  deleteFeedback(replyModalData.id);
                  setReplyModalData(null);
                }}
                title="Xóa Góp Ý"
                style={{
                  padding: "10px 16px", backgroundColor: "var(--danger)", color: "white",
                  border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: "bold"
                }}
              >
                🗑️ Xóa Góp Ý
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn-secondary"
                  onClick={() => setReplyModalData(null)}
                  disabled={isSubmitting}
                >
                  Đóng
                </button>
                <button 
                  className="btn-primary" 
                  onClick={submitReply}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang lưu..." : (replyModalData?.status === 'RESOLVED' ? "Cập nhật" : "Xác nhận gửi")}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
