import React, { createContext, useState, useEffect, useContext } from 'react';
import Modal from '../components/Modal';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

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
    const headers = {
      ...getAuthHeaders(),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (response.status === 401) {
        // Nếu lỗi 401, xóa dữ liệu cũ ngay lập tức để tránh lỗi lặp lại
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
    window.location.href = '/#/admin/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, getAuthHeaders, authFetch }}>
      {children}
      
      {/* Modal thông báo hết hạn phiên - Ép hiển thị trên cùng */}
      {isSessionExpired && (
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
