import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
  const { authState } = useAuth();

  // 관리자인지 확인
  const isAdmin = authState?.user?.role === 'admin';

  if (!isAdmin) {
    // 관리자가 아니면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
