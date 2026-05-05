import React, { useState, useEffect, useCallback } from "react";
import Modal from "../../components/Modal";
import ExportModal from "../../components/ExportModal";
import { useAuth } from "../../contexts/AuthContext";
import { toApiDateTime } from "../../utils/exportUtils";
import "./FeedbackListPage.css";

export default function FeedbackListPage() {
  const { authFetch } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyModalData, setReplyModalData] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showExportModal, setShowExportModal] = useState(false);

  // === Phân trang ===
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // === Lọc ngày ===
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // === Xử lý SĐT ===
  const [activePhonePopup, setActivePhonePopup] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setActivePhonePopup(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handlePhoneClick = (e, id, phone) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopySuccess(id);
    setActivePhonePopup(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // 1. Lấy dữ liệu phân trang từ API
  const fetchFeedbacks = useCallback(async () => {
    const params = new URLSearchParams();
    params.append("page", currentPage);
    params.append("size", pageSize);
    params.append("status", filterStatus);
    if (dateFrom) params.append("from", toApiDateTime(new Date(dateFrom + "T00:00:00")));
    if (dateTo) params.append("to", toApiDateTime(new Date(dateTo + "T23:59:59")));

    try {
      const res = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/suggestions/paged?${params.toString()}`);
      if (res && res.ok) {
        const data = await res.json();
        setFeedbacks(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách góp ý", err);
    }
  }, [currentPage, pageSize, filterStatus, dateFrom, dateTo, authFetch]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  // Reset về trang đầu khi đổi bộ lọc
  const handleFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
    setCurrentPage(0);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(0);
  };

  const handleDateFilter = () => {
    setCurrentPage(0);
    fetchFeedbacks();
  };

  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    setCurrentPage(0);
  };

  // 2. Xóa mềm
  const deleteFeedback = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa góp ý này?")) {
      try {
        const res = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/suggestions/${id}`, {
          method: "DELETE"
        });
        if (res && res.ok) {
          fetchFeedbacks();
        }
      } catch (err) {
        alert("Lỗi hệ thống.");
      }
    }
  };

  const openReplyModal = (fb) => {
    setReplyModalData(fb);
    setReplyText(fb.response || "");
  };

  // 3. Lưu phản hồi
  const submitReply = async () => {
    if (!replyText.trim()) {
      alert("Vui lòng nhập nội dung phản hồi.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/suggestions/${replyModalData.id}/reply`, {
        method: "PUT",
        body: JSON.stringify({ response: replyText }),
      });
      if (res && res.ok) {
        setReplyModalData(null);
        fetchFeedbacks();
      }
    } catch (err) {
      alert("Lỗi hệ thống.");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="feedback-list-page">
      <h1 className="page-title">Quản lý góp ý</h1>

      {/* ===== TOOLBAR ===== */}
      <div className="admin-toolbar">
        {/* Hàng 1: Bộ lọc trạng thái + PageSize + Xuất Excel */}
        <div className="toolbar-row">
          <div className="status-filter-tabs">
            {['ALL', 'PENDING', 'RESOLVED'].map(status => (
              <button key={status}
                className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                onClick={() => handleFilterChange(status)}
              >
                {status === 'ALL' ? 'Tất cả' : status === 'PENDING' ? 'Chưa xử lý' : 'Đã xử lý'}
              </button>
            ))}
          </div>
          <div className="toolbar-right">
            <div className="page-size-selector">
              <label>Hiển thị</label>
              <select value={pageSize} onChange={e => handlePageSizeChange(e.target.value)}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <button className="btn-export" onClick={() => setShowExportModal(true)}>
              📥 Xuất Excel
            </button>
          </div>
        </div>

        {/* Hàng 2: Lọc ngày */}
        <div className="toolbar-row date-filter-row">
          <div className="date-filter-group">
            <label>Từ ngày</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="date-filter-group">
            <label>Đến ngày</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <div className="date-filter-actions">
            <button className="btn-filter-apply" onClick={handleDateFilter}>Lọc</button>
            {(dateFrom || dateTo) && (
              <button className="btn-filter-clear" onClick={clearDateFilter}>Xóa lọc</button>
            )}
          </div>
        </div>

        {/* Thông tin tổng hợp */}
        <div className="toolbar-info">
          <span>{totalElements} góp ý • Trang {currentPage + 1}/{totalPages || 1}</span>
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
            {feedbacks.map((fb) => (
              <tr key={fb.id}>
                <td className="td-code" title={fb.trackingCode}>{fb.id}</td>
                <td className="td-date">{formatDateShort(fb.suggestAt)}</td>
                <td style={{ whiteSpace: "nowrap", position: "relative" }}>
                  <div>{fb.suggestedBy || "Ẩn danh"}</div>
                  {fb.contactPhone && (
                    <div 
                      className="phone-display"
                      onClick={(e) => handlePhoneClick(e, fb.id, fb.contactPhone)}
                    >
                      📞 {fb.contactPhone}
                    </div>
                  )}
                  {activePhonePopup === fb.id && (
                    <div className="phone-popup" onClick={e => e.stopPropagation()}>
                      <div className="phone-popup-header">
                        {copySuccess === fb.id ? "✅ Đã copy" : "Liên hệ"}
                      </div>
                      <div className="phone-popup-actions">
                        <button onClick={() => { navigator.clipboard.writeText(fb.contactPhone); setCopySuccess(fb.id); }}>
                          📋 Copy số
                        </button>
                        <a href={`tel:${fb.contactPhone}`}>
                          📞 Gọi ngay
                        </a>
                      </div>
                    </div>
                  )}
                </td>
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
        {feedbacks.map((fb) => (
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
              <div className="info-item" style={{ flexDirection: "column", alignItems: "flex-start", position: "relative" }}>
                <div><span className="icon-wrap">👤</span> {fb.suggestedBy || "Ẩn danh"}</div>
                {fb.contactPhone && (
                  <div 
                    className="phone-display"
                    onClick={(e) => handlePhoneClick(e, fb.id, fb.contactPhone)}
                    style={{ marginTop: "6px" }}
                  >
                    📞 {fb.contactPhone}
                  </div>
                )}
                {activePhonePopup === fb.id && (
                  <div className="phone-popup" onClick={e => e.stopPropagation()}>
                    <div className="phone-popup-header">
                      {copySuccess === fb.id ? "✅ Đã copy" : "Liên hệ"}
                    </div>
                    <div className="phone-popup-actions">
                      <button onClick={() => { navigator.clipboard.writeText(fb.contactPhone); setCopySuccess(fb.id); }}>
                        📋 Copy số
                      </button>
                      <a href={`tel:${fb.contactPhone}`}>
                        📞 Gọi ngay
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="info-item" style={{ alignItems: "flex-start" }}>
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

      {feedbacks.length === 0 && (
        <div className="empty-state card">
          <p>Chưa có góp ý nào.</p>
        </div>
      )}

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button className="pagination-btn" onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>
            «
          </button>
          <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
            ‹ Trước
          </button>
          <span className="pagination-info">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1}>
            Sau ›
          </button>
          <button className="pagination-btn" onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage >= totalPages - 1}>
            »
          </button>
        </div>
      )}

      {/* ===== EXPORT MODAL ===== */}
      <ExportModal show={showExportModal} onClose={() => setShowExportModal(false)} />

      {/* ===== REPLY MODAL ===== */}
      <Modal show={!!replyModalData} onClose={() => setReplyModalData(null)}>
        <h2 style={{ marginBottom: "15px", color: "var(--red-600)" }}>
          {replyModalData?.status === 'RESOLVED' ? `Chỉnh sửa phản hồi #${replyModalData?.id}` : `Chi tiết góp ý #${replyModalData?.id}`}
        </h2>
        {replyModalData && (
          <div style={{ textAlign: "left", fontSize: "14px", lineHeight: "1.6" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div>
                <strong>Người gửi:</strong> <br />{replyModalData.suggestedBy || "Ẩn danh"}
                {replyModalData.contactPhone && (
                  <div style={{ marginTop: '8px' }}>
                    <a href={`tel:${replyModalData.contactPhone}`} style={{ color: 'var(--red-600)', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--red-50)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--red-200)' }}>
                      📞 {replyModalData.contactPhone}
                    </a>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(replyModalData.contactPhone); alert("Đã copy số điện thoại!"); }}
                      style={{ marginLeft: '8px', background: 'var(--gray-100)', border: '1px solid var(--gray-300)', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', color: 'var(--gray-700)' }}
                      title="Copy số điện thoại"
                    >
                      📋 Copy
                    </button>
                  </div>
                )}
              </div>
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
                onClick={() => { deleteFeedback(replyModalData.id); setReplyModalData(null); }}
                title="Xóa Góp Ý"
                style={{ padding: "10px 16px", backgroundColor: "var(--danger)", color: "white", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontWeight: "bold" }}
              >
                🗑️ Xóa Góp Ý
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn-secondary" onClick={() => setReplyModalData(null)} disabled={isSubmitting}>Đóng</button>
                <button className="btn-primary" onClick={submitReply} disabled={isSubmitting}>
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
