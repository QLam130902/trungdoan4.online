import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from '../components/Modal';

const AuthContext = createContext(null);

// Kiểm tra token JWT đã hết hạn chưa (decode payload trên client)
const isTokenExpired = (jwtToken) => {
  try {
    const payload = JSON.parse(atob(jwtToken.split('.')[1]));
    // exp tính bằng giây (Unix timestamp), Date.now() trả về mili giây
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    // Token không hợp lệ → coi như hết hạn
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const location = useLocation();

  // Khởi tạo: đọc token từ localStorage và kiểm tra hết hạn ngay trên client
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        // Token đã hết hạn → xóa sạch, không set vào state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  // Tự động tắt modal hết hạn khi chuyển hướng sang trang login hoặc trang client
  useEffect(() => {
    if (location.pathname === '/admin/login' || !location.pathname.startsWith('/admin')) {
      setIsSessionExpired(false);
    }
  }, [location.pathname]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setIsSessionExpired(false);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsSessionExpired(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Hàm fetch được bảo vệ: Tự động check 401
  const authFetch = async (url, options = {}) => {
    // Kiểm tra token hết hạn trước khi gửi request (tránh gọi API thừa)
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsSessionExpired(true);
      return null;
    }

    const headers = {
      ...getAuthHeaders(),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (response.status === 401) {
        // Nếu lỗi 401, xóa dữ liệu cũ ngay lập tức
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        
        // Hiện modal báo hết hạn
        setIsSessionExpired(true);
        return null;
      }
      
      return response;
    } catch (error) {
      console.error("AuthFetch Error:", error);
      throw error;
    }
  };

  const handleRedirectLogin = () => {
    setIsSessionExpired(false);
    window.location.hash = '/admin/login';
  };

  // Điều kiện hiển thị modal hết hạn: Chỉ hiển thị trên các trang quản trị admin, loại trừ trang login
  const showExpiredModal = isSessionExpired && 
                           location.pathname.startsWith('/admin') && 
                           location.pathname !== '/admin/login';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, getAuthHeaders, authFetch }}>
      {children}
      
      {/* Modal thông báo hết hạn phiên - Ép hiển thị trên cùng */}
      {showExpiredModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999 }}>
          <Modal show={true} onClose={() => {}}>
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
              <h2 style={{ color: 'var(--red-600)', marginBottom: '15px', fontSize: '24px' }}>Phiên đăng nhập hết hạn</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '30px', fontSize: '16px', lineHeight: '1.6' }}>
                Phiên làm việc của bạn đã kết thúc. <br />
                Vui lòng đăng nhập lại để tiếp tục quản lý hệ thống.
              </p>
              <button 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' 
                }}
                onClick={handleRedirectLogin}
              >
                Đăng nhập lại ngay
              </button>
            </div>
          </Modal>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
