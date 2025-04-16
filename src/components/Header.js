import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { triggerLogout } from "../contexts/api";
import "./Header.css";

// 맨 위 Header
// 로그인 전에 회원가입/로그인 버튼, 로그인 후 짤등록/마이페이지 버튼
function Header() {
  const navigate = useNavigate();
  const { authState } = useAuth();

  const handleSignUp = () => {
    navigate("/signup", { replace: true });
  };

  const handleLogin = () => {
    navigate("/login", { replace: true });
  };

  const handleUpload = () => {
    if (!authState.isLoggedIn) {
      toast.warning("로그인이 필요합니다!");
      return;
    }
    navigate("/uploadmeme", { replace: true });
  };

  const handleMyPage = () => {
    if (authState.username) {
      navigate(`/users/${authState.username}`, { replace: true });
    }
  };

  const handleLogout = () => {
    triggerLogout();
    navigate("/", { replace: true });
  };

  const handleLogoClick = () => {
    window.location.href = "/"; //새로고침하면서 홈으로 이동
  };

  return (
    <div className="Header">
      <h1 className="logo">
        <img
          src={logo}
          alt="Find My Meme 로고"
          className="logo-image"
          onClick={handleLogoClick}
        />
      </h1>
      <div className="nav-buttons">
        {authState.isLoggedIn ? (
          <>
            <button onClick={handleUpload}>짤등록</button>
            <div className="nav-dropdown">
              <button onClick={handleMyPage}>마이페이지</button>
              <div className="dropdown-menu">
                <button onClick={handleMyPage}>나의 밈</button>
                <button onClick={handleMyPage}>내 정보</button>
                <button onClick={handleMyPage}>게시글 관리</button>
                <button id="logout" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <button onClick={handleSignUp}>회원가입</button>
            <button onClick={handleLogin}>로그인</button>
          </>
        )}
      </div>
    </div>
  );
}
export default Header;
