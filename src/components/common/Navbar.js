import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { triggerLogout } from "../../contexts/api";
import useAuthStore from "../../store/useAuthStore";
import logo from "../../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 가져오기
  const usernameFromStore = useAuthStore((state) => state.username);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const getActiveClass = (path) => {
    return location.pathname === path ? "active-menu" : "";
  };

  const handleLogoClick = () => {
    window.location.href = "/"; //새로고침하면서 홈으로 이동
  };

  const handleUpload = () => {
    if (!isLoggedIn) {
      toast.warning("로그인이 필요합니다!");
      return;
    }
    navigate("/uploadmeme", { replace: true });
  };

  const handleMyPageClick = () => {
    if (isLoggedIn) {
      navigate(`/users/${usernameFromStore}`, { replace: true });
    } else {
      console.log("로그인안됐는데?");
      navigate("/login");
    }
  };

  const handleMouseEnter = () => {
    if (isLoggedIn) {
      setIsDropdownVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (isLoggedIn) {
      setIsDropdownVisible(false); // 마우스가 나가면 드롭다운 숨기기
    }
  };

  const handleLogout = () => {
    triggerLogout();
    navigate("/", { replace: true });
  };

  return (
    <div className="navbar">
      <h1 className="logo">
        <img
          src={logo}
          alt="Find My Meme 로고"
          className="logo-image"
          onClick={handleLogoClick}
        />
      </h1>
      <ul className="navbar-menu">
        <li className={`menu-all ${getActiveClass("/")}`}>
          <Link to="/">모든 표현</Link>
        </li>
        <li className={`menu-top ${getActiveClass("/topmeme")}`}>
          <Link to="/topmeme">인기 표현</Link>
        </li>
        <li className={`menu-find ${getActiveClass("/findmeme")}`}>
          <Link to="/findmeme">내 표현을 찾아줘</Link>
        </li>
      </ul>
      <ul className="navbar-sidemenu">
        <li onClick={handleUpload}>
          <IoCloudUploadOutline style={{ fontSize: "24px" }} />
        </li>
        <li
          className="mypage"
          onClick={handleMyPageClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <GoPerson style={{ fontSize: "24px" }} />
          {isLoggedIn && isDropdownVisible && (
            <div className="dropdown-menu">
              <ul>
                <li onClick={handleMyPageClick}>나의 밈</li>
                <li onClick={handleMyPageClick}>내 정보</li>
                <li onClick={handleMyPageClick}>게시글 관리</li>
                <li onClick={handleLogout}>로그아웃</li>
              </ul>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
