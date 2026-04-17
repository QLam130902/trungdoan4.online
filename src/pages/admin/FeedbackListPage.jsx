import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import "./FeedbackListPage.css";

export default function FeedbackListPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyModalData, setReplyModalData] = useState(null); // Góp ý đang được chọn để phản hồi
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Lấy dữ liệu thực từ API
  const fetchFeedbacks = () => {
    fetch("http://160.187.229.25/suggestions")
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
        const res = await fetch(`http://160.187.229.25/suggestions/${id}`, {
          method: "DELETE",
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
      const res = await fetch(`http://160.187.229.25/suggestions/${replyModalData.id}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
    if (status === "PENDING") return "status-new";
    if (status === "RESOLVED") return "status-done";
    return "";
  };

  const formatStatus = (status) => {
    if (status === "PENDING") return "Chờ xử lý";
    if (status === "RESOLVED") return "Đã phản hồi";
    return status;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  return (
    <div className="feedback-list-page">
      <h1 className="page-title">Quản lý góp ý</h1>
      <p className="page-subtitle">
        Danh sách {feedbacks.length} góp ý hợp lệ trong hệ thống
      </p>

      <div className="feedback-table-wrapper">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>ID Góp Ý</th>
              <th>Người gửi</th>
              <th>Nội dung</th>
              <th>Trạng thái</th>
              <th>Ngày nộp</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb.id}>
                <td className="td-code" title={fb.trackingCode}>
                  {fb.id}
                </td>
                <td>{fb.suggestedBy || "Ẩn danh"}</td>
                <td className="td-content">{fb.body}</td>
                <td>
                  {/* Sử dụng giao diện CSS cũ nhưng mapping dữ liệu mới */}
                  <span className={`status-select ${getStatusClass(fb.status)}`} style={{ padding: "5px 10px", borderRadius: "5px", display: "inline-block", textAlign: "center" }}>
                    {formatStatus(fb.status)}
                  </span>
                </td>
                <td className="td-date">{formatDate(fb.suggestAt)}</td>
                <td style={{ minWidth: "100px" }}>
                  <button
                    className="btn-reply-explicit"
                    onClick={() => openReplyModal(fb)}
                    title="Viết Phản Hồi"
                    style={{ 
                      marginRight: "8px", 
                      padding: "6px 12px", 
                      backgroundColor: "#4CAF50", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "4px", 
                      cursor: "pointer", 
                      fontWeight: "bold" 
                    }}
                  >
                    ✏️ Phản hồi
                  </button>
                  <button
                    className="btn-delete-explicit"
                    onClick={() => deleteFeedback(fb.id)}
                    title="Xóa Góp Ý"
                    style={{ 
                      padding: "6px 12px", 
                      backgroundColor: "#f44336", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "4px", 
                      cursor: "pointer", 
                      fontWeight: "bold" 
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {feedbacks.length === 0 && (
        <div className="empty-state card">
          <p>Chưa có góp ý nào.</p>
        </div>
      )}

      {/* Hiển thị Popup Modal Nhập câu trả lời */}
      <Modal show={!!replyModalData} onClose={() => setReplyModalData(null)}>
        <h2 style={{ marginBottom: "15px", color: "var(--military-green)"}}>Phản hồi góp ý #{replyModalData?.id}</h2>
        {replyModalData && (
          <div style={{ textAlign: "left", fontSize: "15px" }}>
            <p><strong>Người gửi:</strong> {replyModalData.suggestedBy}</p>
            <p><strong>Nội dung:</strong> {replyModalData.body}</p>
            
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                Nội dung trả lời (Hệ thống sẽ chuyển thành Đã phản hồi):
              </label>
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ width: "100%", height: "120px", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
                placeholder="Gõ nội dung giải quyết / phản hồi..."
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
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
                {isSubmitting ? "Đang lưu..." : "Xác nhận gửi"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
