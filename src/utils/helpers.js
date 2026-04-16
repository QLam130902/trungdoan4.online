/**
 * Tạo mã góp ý ngẫu nhiên
 * @returns {string} Mã góp ý dạng GY-XXXXXX
 */
export const createFeedbackCode = () => {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GY-${randomPart}`;
};
