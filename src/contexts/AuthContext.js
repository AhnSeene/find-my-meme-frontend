import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    token: null,
    username: null,  // username 필드 추가
    roles: [] 
  });
  const navigate = useNavigate();
  
  // 페이지 로드 시 로컬 스토리지에서 토큰과 username을 가져와 상태 복원
  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    const storedUsername = localStorage.getItem('username');  // username 가져오기
    if (storedToken && storedUsername) {
      setAuthState({ isLoggedIn: true, token: storedToken, username: storedUsername });
    }
  }, []);

  const login = (token, username) => {
    setAuthState({ isLoggedIn: true, token, username });
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('username', username);  // username 저장
  };

  const logout = () => {
    setAuthState({ isLoggedIn: false, token: null, username: null });
    localStorage.removeItem('jwtToken'); // JWT 토큰 제거
    localStorage.removeItem('username'); // username 제거
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

