import React, { useState, useMemo } from "react";
import { localContactsData } from "../../data/localContactsData";
import "./LocalContactsPage.css";

const cleanPhone = (phone) => (phone ? phone.replace(/[^\d+]/g, "") : "");

export default function LocalContactsPage() {
  const [selectedProvince, setSelectedProvince] = useState("ALL");
  const [selectedWardId, setSelectedWardId] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopyPhone = (e, phone, key) => {
    e.preventDefault();
    e.stopPropagation();
    const digits = cleanPhone(phone);
    if (!digits) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(digits).catch(() => {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = digits;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Danh sách phường/xã theo tỉnh đang chọn (chỉ giữ địa phương có đầu mối có SĐT)
  const availableWards = useMemo(() => {
    const wards = [];
    localContactsData.forEach((prov) => {
      if (selectedProvince === "ALL" || prov.id === selectedProvince) {
        prov.wards.forEach((w) => {
          const validContacts = (w.contacts || []).filter(
            (c) => cleanPhone(c.phone).length >= 8
          );
          if (validContacts.length > 0) {
            wards.push({ ...w, contacts: validContacts });
          }
        });
      }
    });
    return wards;
  }, [selectedProvince]);

  // Lọc theo tỉnh, phường/xã và từ khóa tìm kiếm
  const filteredWards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return availableWards
      .filter((w) => selectedWardId === "ALL" || w.id === selectedWardId)
      .map((ward) => {
        if (!q) return ward;
        const wardMatch =
          ward.name.toLowerCase().includes(q) ||
          ward.area.toLowerCase().includes(q) ||
          ward.province.toLowerCase().includes(q);
        if (wardMatch) return ward;

        const matchedContacts = ward.contacts.filter((c) => {
          const nameStr = c.fullName || `${c.rank || ""} ${c.name || ""}`.trim();
          const fullText = `${nameStr} ${c.role || ""} ${c.phone || ""}`.toLowerCase();
          return fullText.includes(q);
        });
        if (matchedContacts.length > 0) {
          return { ...ward, contacts: matchedContacts };
        }
        return null;
      })
      .filter(Boolean);
  }, [availableWards, selectedWardId, searchQuery]);

  const handleProvinceChange = (provId) => {
    setSelectedProvince(provId);
    setSelectedWardId("ALL");
  };

  return (
    <div className="local-contacts-page">
      {/* Header giới thiệu */}
      <div className="lc-header-card">
        <h2>Thông tin lãnh đạo cấp ủy, chính quyền địa phương, các chức sắc tôn giáo</h2>
        <p>
          Danh bạ liên hệ phối hợp công tác dân vận, chính quyền địa phương và các cơ sở tôn giáo trên địa bàn (bấm trực tiếp vào số điện thoại để gọi).
        </p>
      </div>

      {/* Bộ lọc Tỉnh / Thành phố */}
      <div className="lc-province-tabs">
        <button
          type="button"
          className={`lc-prov-tab ${selectedProvince === "ALL" ? "active" : ""}`}
          onClick={() => handleProvinceChange("ALL")}
        >
          Tất cả ({localContactsData.reduce((acc, p) => acc + p.wards.length, 0)})
        </button>
        {localContactsData.map((prov) => (
          <button
            key={prov.id}
            type="button"
            className={`lc-prov-tab ${selectedProvince === prov.id ? "active" : ""}`}
            onClick={() => handleProvinceChange(prov.id)}
          >
            {prov.name} ({prov.wards.length})
          </button>
        ))}
      </div>

      {/* Thanh tìm kiếm & chọn nhanh Phường/Xã */}
      <div className="lc-filter-bar">
        <div className="lc-search-box">
          <span className="lc-search-icon">🔍</span>
          <input
            type="text"
            className="lc-search-input"
            placeholder="Tìm theo họ tên, chức vụ, chùa/giáo xứ, SĐT, địa phương..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="lc-clear-btn"
              onClick={() => setSearchQuery("")}
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        <select
          className="lc-ward-select"
          value={selectedWardId}
          onChange={(e) => setSelectedWardId(e.target.value)}
        >
          <option value="ALL">-- Tất cả địa phương ({availableWards.length} Phường/Xã) --</option>
          {availableWards.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} ({w.province})
            </option>
          ))}
        </select>
      </div>

      {/* Danh sách các Địa phương (Phường / Xã) */}
      <div className="lc-ward-list">
        {filteredWards.length > 0 ? (
          filteredWards.map((ward) => (
            <div key={ward.id} className="lc-ward-card">
              <div className="lc-ward-header">
                <div className="lc-ward-title-group">
                  <span className="lc-ward-icon">📍</span>
                  <div>
                    <h3 className="lc-ward-name">{ward.name}</h3>
                    <span className="lc-ward-meta">
                      {ward.area ? `${ward.area} • ` : ""}{ward.province}
                    </span>
                  </div>
                </div>
                <span className="lc-ward-count">{ward.contacts.length} liên hệ</span>
              </div>

              <div className="lc-table-wrapper">
                <table className="lc-table">
                  <thead>
                    <tr>
                      <th className="lc-th-stt">TT</th>
                      <th>Họ và tên</th>
                      <th>Chức vụ / Đơn vị</th>
                      <th className="lc-th-phone">Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ward.contacts.map((c, idx) => {
                      const rowKey = `${ward.id}-${idx}`;
                      const telHref = cleanPhone(c.phone);
                      const displayName =
                        c.fullName || `${c.rank || ""} ${c.name || ""}`.trim();
                      return (
                        <tr key={rowKey}>
                          <td className="lc-td-stt">{idx + 1}</td>
                          <td className="lc-td-person">
                            <span className="lc-mobile-index">{idx + 1}. </span>
                            <span className="lc-person-name">{displayName}</span>
                          </td>
                          <td className="lc-td-role">{c.role}</td>
                          <td className="lc-td-phone">
                            <div className="lc-phone-actions">
                              <a
                                href={`tel:${telHref}`}
                                className="lc-call-btn"
                                title={`Gọi ${displayName}`}
                              >
                                <span>📞</span>
                                <span>{c.phone}</span>
                              </a>
                              <button
                                type="button"
                                className={`lc-copy-btn ${copiedKey === rowKey ? "copied" : ""}`}
                                onClick={(e) => handleCopyPhone(e, c.phone, rowKey)}
                                title="Sao chép số điện thoại"
                              >
                                {copiedKey === rowKey ? "✓" : "📋"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="lc-empty-state">
            Không tìm thấy địa phương hoặc cá nhân nào phù hợp với từ khóa.
          </div>
        )}
      </div>
    </div>
  );
}
