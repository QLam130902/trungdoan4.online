import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu...</div>;
  }

  // Nếu chưa đăng nhập, đá về trang login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Nếu route này yêu cầu quyền Admin, nhưng user lại là Officer
  if (requireAdmin && user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  // Nếu hợp lệ, render component con
  return children;
};

export default ProtectedRoute;
