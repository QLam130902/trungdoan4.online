import React, { useState } from "react";
import { faqData } from "../../data/faqData";
import "./FAQPage.css";

const categories = [
  { id: "all", name: "Tất cả" },
  { id: "sinh-hoat", name: "Sinh hoạt" },
  { id: "nghi-phep", name: "Nghỉ phép" },
  { id: "than-nhan", name: "Thân nhân" },
  { id: "he-thong", name: "Hệ thống" },
];

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const filteredData = activeTab === "all" 
    ? faqData 
    : faqData.filter(item => item.category === activeTab);

  return (
    <div className="faq-page">
      <div className="faq-header-card">
        <h2>Hỏi đáp & Chế độ chính sách</h2>
        <p>
          Tra cứu nhanh các chế độ tiêu chuẩn và hướng dẫn sử dụng hệ thống.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="faq-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`faq-tab-btn ${activeTab === cat.id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(cat.id);
              setOpenIndex(null); // Reset accordion when switching tabs
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            const globalIndex = `${activeTab}-${index}`;
            return (
              <div
                key={globalIndex}
                className={`faq-item ${openIndex === globalIndex ? "open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggle(globalIndex)}
                  aria-expanded={openIndex === globalIndex}
                >
                  <span className="faq-q-icon">Q</span>
                  <span className="faq-q-text">{item.question}</span>
                  <span className={`faq-chevron ${openIndex === globalIndex ? "open" : ""}`}>
                    ▼
                  </span>
                </button>
                <div className={`faq-answer ${openIndex === globalIndex ? "open" : ""}`}>
                  <div className="faq-answer-inner">
                    <span className="faq-a-icon">A</span>
                    <div className="faq-content-wrapper">
                      <p>{item.answer}</p>
                      {item.docRef && (
                        <div className="faq-doc-ref">
                          <span className="doc-label">Căn cứ: {item.docRef}</span>
                          <button 
                            className="btn-download-doc"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.fileName) {
                                window.open(`${import.meta.env.BASE_URL}docs/${item.fileName}`, '_blank');
                              }
                            }}
                          >
                            📥 Tải văn bản gốc
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="faq-empty">Không có câu hỏi nào trong mục này.</div>
        )}
      </div>
    </div>
  );
}
