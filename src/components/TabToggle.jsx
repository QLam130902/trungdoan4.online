import React from "react";
import "./TabToggle.css";

export default function TabToggle({ tabs, activeTab, onChange }) {
  return (
    <div className="tab-toggle">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`tab-btn ${activeTab === tab.value ? "active" : ""}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
