import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getWeekRange, getMonthRange, getQuarterRange, 
  getCurrentQuarter, toApiDateTime, exportToExcel 
} from '../utils/exportUtils';
import './ExportModal.css';

export default function ExportModal({ show, onClose }) {
  const { authFetch } = useAuth();
  const [exportType, setExportType] = useState('week');
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter());
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);

  if (!show) return null;

  // Tính khoảng thời gian dựa trên lựa chọn
  const getRange = () => {
    switch (exportType) {
      case 'week': return getWeekRange();
      case 'month': return getMonthRange();
      case 'quarter': return getQuarterRange(selectedQuarter);
      case 'custom': {
        const from = customFrom ? new Date(customFrom + 'T00:00:00') : null;
        const to = customTo ? new Date(customTo + 'T23:59:59') : null;
        return { from, to, label: 'Tùy chọn' };
      }
      case 'all':
      default:
        return { from: null, to: null, label: 'Tất cả' };
    }
  };

  // Hiển thị mô tả khoảng thời gian
  const getRangeDescription = () => {
    const range = getRange();
    const fmt = (d) => {
      if (!d) return '...';
      const pad = (n) => n.toString().padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    };
    if (exportType === 'all') return 'Toàn bộ dữ liệu trong hệ thống';
    return `Từ ${fmt(range.from)} đến ${fmt(range.to)}`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportResult(null);
    try {
      const range = getRange();
      const params = new URLSearchParams();
      if (range.from) params.append('from', toApiDateTime(range.from));
      if (range.to) params.append('to', toApiDateTime(range.to));

      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await authFetch(`${apiUrl}/suggestions/export?${params.toString()}`);

      if (!res) return; // Đã xử lý hết hạn trong AuthContext
      if (!res.ok) throw new Error('Lỗi kết nối máy chủ');
      const data = await res.json();

      if (data.length === 0) {
        setExportResult({ success: false, message: 'Không có dữ liệu trong khoảng thời gian này.' });
        return;
      }

      const fileName = await exportToExcel(data, range.label);
      setExportResult({ 
        success: true, 
        message: `Đã xuất thành công ${data.length} bản ghi → ${fileName}` 
      });
    } catch (err) {
      setExportResult({ success: false, message: 'Lỗi: ' + err.message });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="export-modal" onClick={e => e.stopPropagation()}>
        <div className="export-header">
          <h2>📊 Xuất báo cáo Excel</h2>
          <button className="export-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="export-body">
          <label className="export-label">Chọn phạm vi xuất</label>
          <div className="export-options">
            <label className={`export-option ${exportType === 'week' ? 'selected' : ''}`}>
              <input type="radio" name="exportType" value="week" 
                checked={exportType === 'week'} onChange={e => setExportType(e.target.value)} />
              <span className="option-icon">📅</span>
              <span className="option-text">Tuần này</span>
            </label>
            <label className={`export-option ${exportType === 'month' ? 'selected' : ''}`}>
              <input type="radio" name="exportType" value="month"
                checked={exportType === 'month'} onChange={e => setExportType(e.target.value)} />
              <span className="option-icon">🗓️</span>
              <span className="option-text">Tháng này</span>
            </label>
            <label className={`export-option ${exportType === 'quarter' ? 'selected' : ''}`}>
              <input type="radio" name="exportType" value="quarter"
                checked={exportType === 'quarter'} onChange={e => setExportType(e.target.value)} />
              <span className="option-icon">📊</span>
              <span className="option-text">Theo quý</span>
            </label>
            <label className={`export-option ${exportType === 'custom' ? 'selected' : ''}`}>
              <input type="radio" name="exportType" value="custom"
                checked={exportType === 'custom'} onChange={e => setExportType(e.target.value)} />
              <span className="option-icon">🔧</span>
              <span className="option-text">Tùy chọn</span>
            </label>
            <label className={`export-option ${exportType === 'all' ? 'selected' : ''}`}>
              <input type="radio" name="exportType" value="all"
                checked={exportType === 'all'} onChange={e => setExportType(e.target.value)} />
              <span className="option-icon">📋</span>
              <span className="option-text">Tất cả</span>
            </label>
          </div>

          {/* Chọn quý */}
          {exportType === 'quarter' && (
            <div className="export-quarter-picker">
              <label className="export-label">Chọn quý</label>
              <div className="quarter-buttons">
                {[1, 2, 3, 4].map(q => (
                  <button key={q}
                    className={`quarter-btn ${selectedQuarter === q ? 'active' : ''}`}
                    onClick={() => setSelectedQuarter(q)}
                  >
                    Quý {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chọn ngày tùy chỉnh */}
          {exportType === 'custom' && (
            <div className="export-custom-dates">
              <div className="date-field">
                <label>Từ ngày</label>
                <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
              </div>
              <div className="date-field">
                <label>Đến ngày</label>
                <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} />
              </div>
            </div>
          )}

          {/* Mô tả phạm vi */}
          <div className="export-range-info">
            <span className="range-icon">ℹ️</span>
            <span className="range-text">{getRangeDescription()}</span>
          </div>

          {/* Kết quả xuất */}
          {exportResult && (
            <div className={`export-result ${exportResult.success ? 'success' : 'error'}`}>
              <span>{exportResult.success ? '✅' : '⚠️'}</span>
              <span>{exportResult.message}</span>
            </div>
          )}
        </div>

        <div className="export-footer">
          <button className="btn-secondary" onClick={onClose}>Đóng</button>
          <button 
            className="btn-export-confirm" 
            onClick={handleExport}
            disabled={isExporting || (exportType === 'custom' && (!customFrom || !customTo))}
          >
            {isExporting ? '⏳ Đang xuất...' : '📥 Xuất file Excel'}
          </button>
        </div>
      </div>
    </div>
  );
}
