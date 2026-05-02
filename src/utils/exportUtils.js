import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Tính khoảng thời gian của tuần hiện tại (Thứ 2 → hiện tại)
 */
export function getWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=CN, 1=T2...
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);
  
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  
  return { from: monday, to: end, label: 'Tuần này' };
}

/**
 * Tính khoảng thời gian của tháng hiện tại
 */
export function getMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  firstDay.setHours(0, 0, 0, 0);
  
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  lastDay.setHours(23, 59, 59, 999);
  
  return { from: firstDay, to: lastDay, label: `Tháng ${now.getMonth() + 1}` };
}

/**
 * Tính khoảng thời gian của quý (theo lịch VN)
 */
export function getQuarterRange(quarter) {
  const now = new Date();
  const year = now.getFullYear();
  const quarters = {
    1: { from: new Date(year, 0, 1), to: new Date(year, 2, 31, 23, 59, 59, 999) },
    2: { from: new Date(year, 3, 1), to: new Date(year, 5, 30, 23, 59, 59, 999) },
    3: { from: new Date(year, 6, 1), to: new Date(year, 8, 30, 23, 59, 59, 999) },
    4: { from: new Date(year, 9, 1), to: new Date(year, 11, 31, 23, 59, 59, 999) },
  };
  return { ...quarters[quarter], label: `Quý ${quarter}/${year}` };
}

export function getCurrentQuarter() {
  const month = new Date().getMonth();
  return Math.floor(month / 3) + 1;
}

export function toApiDateTime(date) {
  if (!date) return null;
  const d = new Date(date);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatDateVN(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Xuất dữ liệu ra file Excel (.xlsx) với định dạng chuẩn:
 * - Font: Times New Roman, Size: 14
 * - Header: In đậm, Kẻ bảng (Borders)
 */
export async function exportToExcel(data, rangeLabel = 'Tất cả') {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Danh sách góp ý');

  // 1. Định nghĩa các cột theo thứ tự mới
  worksheet.columns = [
    { header: 'STT', key: 'stt', width: 8 },
    { header: 'Mã tra cứu', key: 'trackingCode', width: 15 },
    { header: 'Người gửi', key: 'suggestedBy', width: 20 },
    { header: 'Ngày gửi', key: 'suggestAt', width: 20 },
    { header: 'Nội dung góp ý', key: 'body', width: 50 },
    { header: 'Trạng thái', key: 'status', width: 15 },
    { header: 'Người xử lý', key: 'handledBy', width: 25 },
    { header: 'Ngày xử lý', key: 'handledAt', width: 20 },
    { header: 'Nội dung phản hồi', key: 'response', width: 50 },
  ];

  // 2. Thêm dữ liệu vào bảng
  data.forEach((item, index) => {
    worksheet.addRow({
      stt: index + 1,
      trackingCode: item.trackingCode || '',
      suggestedBy: item.suggestedBy || 'Ẩn danh',
      suggestAt: formatDateVN(item.suggestAt),
      body: item.body || '',
      status: item.status === 'RESOLVED' ? 'Đã xử lý' : 'Chưa xử lý',
      handledBy: item.handledBy || '',
      handledAt: formatDateVN(item.handledAt),
      response: item.response || '',
    });
  });

  // 3. Định dạng Font và Border cho toàn bộ bảng
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      // Font: Times New Roman, Size: 14
      cell.font = {
        name: 'Times New Roman',
        size: 14,
        bold: rowNumber === 1 // Header in đậm
      };

      // Kẻ bảng (Borders)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      // Căn giữa STT và Mã tra cứu
      if (cell.address.startsWith('A') || cell.address.startsWith('B') || cell.address.startsWith('E')) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }
    });

    // Định dạng Header riêng
    if (rowNumber === 1) {
      row.height = 30; // Header cao hơn
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' } // Màu nền xám nhạt cho Header
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    }
  });

  // 4. Xuất file
  const buffer = await workbook.xlsx.writeBuffer();
  const today = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const dateStr = `${pad(today.getDate())}${pad(today.getMonth() + 1)}${today.getFullYear()}`;
  const safeLabel = rangeLabel.replace(/[\/\\?*[\]]/g, '_');
  const fileName = `BaoCao_GopY_${safeLabel}_${dateStr}.xlsx`;

  saveAs(new Blob([buffer]), fileName);
  return fileName;
}
