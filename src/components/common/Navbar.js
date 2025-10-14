import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { HiOutlinePhotograph } from "react-icons/hi";
import { FiUser, FiEdit3, FiLogOut } from "react-icons/fi";
import { triggerLogout } from "../../contexts/api";
import useAuthStore from "../../store/useAuthStore";
import logo from "../../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const usernameFromStore = useAuthStore((state) => state.username);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getActiveClass = (path) => {
    return location.pathname === path ? "active-menu" : "";
  };

  const handleLogoClick = () => {
    window.location.href = "/";
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

  const handleLogout = () => {
    triggerLogout();
    navigate("/", { replace: true });
  };

  return (
    <div className={`navbar ${isScrolled ? "scrolled" : ""}`}>
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
          <IoCloudUploadOutline style={{ fontSize: "22px" }} />
        </li>
        <li
          className="mypage"
          onClick={handleMyPageClick}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <GoPerson style={{ fontSize: "22px" }} />
          {isLoggedIn && showDropdown && (
            <div
              className="dropdown-menu"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <ul>
                <li onClick={handleMyPageClick}>
                  <span className="menu-icon">
                    <HiOutlinePhotograph />
                  </span>
                  <span>나의 밈</span>
                </li>

                <li onClick={handleMyPageClick}>
                  <span className="menu-icon">
                    <FiUser />
                  </span>
                  <span>내 정보</span>
                </li>

                <li onClick={handleMyPageClick}>
                  <span className="menu-icon">
                    <FiEdit3 />
                  </span>
                  <span>게시글 관리</span>
                </li>

                <li onClick={handleLogout}>
                  <span className="menu-icon">
                    <FiLogOut />
                  </span>
                  <span>로그아웃</span>
                </li>
              </ul>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
