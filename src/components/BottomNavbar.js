import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { FiThumbsUp } from "react-icons/fi";
import "./bottomNavbar.css";
import { useAuth } from "../contexts/AuthContext";

function BottomNavbar() {
  const { authState } = useAuth();
  return (
    <div className="bottomnavbar">
      <ul>
        <li>
          <Link to="/">
            <AiFillHome className="icon" />
            <span>모든표현</span>
          </Link>
        </li>
        <li>
          <Link to="/topmeme">
            <FiThumbsUp className="icon" />
            <span>인기표현</span>
          </Link>
        </li>
        <li>
          <Link to="/findmeme">
            <IoSearch className="icon" />
            <span>내 표현을 찾아줘</span>
          </Link>
        </li>
        <li>
          <Link to={`/users/${authState.username}`}>
            <CgProfile className="icon" />
            <span>마이페이지</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
export default BottomNavbar;
