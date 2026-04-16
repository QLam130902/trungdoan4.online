import React, { useState } from "react";
import { faqData } from "../../data/faqData";
import "./FAQPage.css";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="faq-page">
      <div className="faq-header-card">
        <h2>Câu hỏi thường gặp</h2>
        <p>
          Giải đáp các thắc mắc về hệ thống hòm thư góp ý trực tuyến của đơn
          vị.
        </p>
      </div>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? "open" : ""}`}
          >
            <button
              type="button"
              className="faq-question"
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
            >
              <span className="faq-q-icon">Q</span>
              <span className="faq-q-text">{item.question}</span>
              <span className={`faq-chevron ${openIndex === index ? "open" : ""}`}>
                ▼
              </span>
            </button>
            <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
              <div className="faq-answer-inner">
                <span className="faq-a-icon">A</span>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
