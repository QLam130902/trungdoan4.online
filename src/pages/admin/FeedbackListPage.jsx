import React, { useState } from "react";
import "./FeedbackListPage.css";

// Mock data
const initialFeedbacks = [
  {
    id: "GY-A1B2C3",
    sender: "Ẩn danh",
    officer: "Nguyễn Văn An",
    content: "Đề nghị cải thiện điều kiện ăn ở cho chiến sĩ mới.",
    status: "Đã tiếp nhận",
    date: "2026-04-14",
  },
  {
    id: "GY-D4E5F6",
    sender: "Trần Văn Hùng",
    officer: "Không chỉ định",
    content: "Góp ý về lịch thăm nuôi cần linh hoạt hơn.",
    status: "Đang xử lý",
    date: "2026-04-13",
  },
  {
    id: "GY-G7H8I9",
    sender: "Ẩn danh",
    officer: "Lê Quốc Cường",
    content: "Cảm ơn đơn vị đã quan tâm tốt đến sức khỏe chiến sĩ.",
    status: "Đã phản hồi và hoàn tất",
    date: "2026-04-10",
  },
];

const statusOptions = ["Đã tiếp nhận", "Đang xử lý", "Đã phản hồi và hoàn tất"];

export default function FeedbackListPage() {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);

  const updateStatus = (id, newStatus) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, status: newStatus } : fb))
    );
  };

  const deleteFeedback = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa góp ý này?")) {
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
    }
  };

  const getStatusClass = (status) => {
    if (status.includes("tiếp nhận")) return "status-new";
    if (status.includes("xử lý")) return "status-progress";
    return "status-done";
  };

  return (
    <div className="feedback-list-page">
      <h1 className="page-title">Quản lý góp ý</h1>
      <p className="page-subtitle">
        Danh sách {feedbacks.length} góp ý từ thân nhân
      </p>

      <div className="feedback-table-wrapper">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Người gửi</th>
              <th>Cán bộ</th>
              <th>Nội dung</th>
              <th>Trạng thái</th>
              <th>Ngày</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb.id}>
                <td className="td-code">{fb.id}</td>
                <td>{fb.sender}</td>
                <td>{fb.officer}</td>
                <td className="td-content">{fb.content}</td>
                <td>
                  <select
                    className={`status-select ${getStatusClass(fb.status)}`}
                    value={fb.status}
                    onChange={(e) => updateStatus(fb.id, e.target.value)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="td-date">{fb.date}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => deleteFeedback(fb.id)}
                    title="Xóa"
                  >
                    🗑️
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
    </div>
  );
}
