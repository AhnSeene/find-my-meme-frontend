import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { FiThumbsUp } from "react-icons/fi";
import "./bottomNavbar.css";
import useAuthStore from "../../store/useAuthStore";

function BottomNavbar() {
  const usernameFromStore = useAuthStore((state) => state.username);
  return (
    <nav className="bottomnavbar">
      <NavLink to="/" end className={({ isActive }) => `bottomnavbar-item ${isActive ? "active" : ""}`}>
        <AiFillHome className="bottomnavbar-icon" />
        <span>모든표현</span>
      </NavLink>
      <NavLink to="/topmeme" className={({ isActive }) => `bottomnavbar-item ${isActive ? "active" : ""}`}>
        <FiThumbsUp className="bottomnavbar-icon" />
        <span>인기표현</span>
      </NavLink>
      <NavLink to="/findmeme" className={({ isActive }) => `bottomnavbar-item ${isActive ? "active" : ""}`}>
        <IoSearch className="bottomnavbar-icon" />
        <span>표현찾기</span>
      </NavLink>
      <NavLink to={`/users/${usernameFromStore}`} className={({ isActive }) => `bottomnavbar-item ${isActive ? "active" : ""}`}>
        <CgProfile className="bottomnavbar-icon" />
        <span>마이페이지</span>
      </NavLink>
    </nav>
  );
}
export default BottomNavbar;
