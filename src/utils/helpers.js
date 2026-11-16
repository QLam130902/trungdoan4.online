/**
 * Tạo mã góp ý ngẫu nhiên gồm 8 ký tự chữ hoa và số
 * @returns {string} Mã góp ý dạng K8P4M9X2
 */
export const createFeedbackCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
