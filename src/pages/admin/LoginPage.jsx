import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Đăng nhập thất bại');
      }

      const data = await response.json();
      
      // Lưu vào Context (đồng thời lưu localStorage)
      login(
        {
          username: data.username,
          fullName: data.fullName,
          role: data.role
        },
        data.token
      );

      // Chuyển hướng vào trang quản trị
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Lỗi kết nối đến máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '100vh', backgroundColor: '#FFF9E6'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--red-600)', margin: '0 0 10px 0' }}>HỆ THỐNG QUẢN TRỊ</h2>
          <p style={{ color: 'var(--gray-500)', margin: 0, fontWeight: '500' }}>Hòm thư góp ý trực tuyến</p>
        </div>

        {error && (
          <div className="error-msg" style={{ marginBottom: '20px', justifyContent: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="form">
          <div className="field">
            <label className="label">Tài khoản</label>
            <input 
              type="text" 
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Nhập tên đăng nhập..."
            />
          </div>

          <div className="field" style={{ marginBottom: '10px' }}>
            <label className="label">Mật khẩu</label>
            <input 
              type="password" 
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu..."
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, marginTop: '10px' }}
          >
            {isLoading ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: 'var(--sky-600)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            ← Quay lại trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
