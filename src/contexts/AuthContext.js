import React, { createContext, useContext, useState, useEffect } from "react";
import { AUTH_EVENTS } from "./api";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    token: null,
    username: null, // username 필드 추가
  });

  // 페이지 로드 시 로컬 스토리지에서 토큰과 username을 가져와 상태 복원
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedUsername = localStorage.getItem("username"); // username 가져오기
    if (storedToken && storedUsername) {
      setAuthState({
        isLoggedIn: true,
        token: storedToken,
        username: storedUsername,
      });
    }

    // 로그아웃 이벤트 리스닝
    const handleLogout = () => {
      logout(); // 로그아웃 처리
      console.log("handleLogout실행됨");
    };

    window.addEventListener(AUTH_EVENTS.LOGOUT_REQUIRED, handleLogout);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener(AUTH_EVENTS.LOGOUT_REQUIRED, handleLogout);
    };
  }, []);

  const login = (token, username) => {
    setAuthState({ isLoggedIn: true, token, username });
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("username", username); // username 저장
  };

  const logout = () => {
    console.log("로그아웃처리중");
    setAuthState({ isLoggedIn: false, token: null, username: null });
    localStorage.removeItem("jwtToken"); // JWT 토큰 제거
    localStorage.removeItem("username"); // username 제거
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
