import { CgProfile } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { FiThumbsUp } from "react-icons/fi";
import "./bottomNavbar.css";

function BottomNavbar() {
  return (
    <div className="bottomnavbar">
      <ul>
        <li>
          <AiFillHome className="icon" />
          <span>모든표현</span>
        </li>
        <li>
          <FiThumbsUp className="icon" />
          <span>인기표현</span>
        </li>
        <li>
          <IoSearch className="icon" />
          <span>내 표현을 찾아줘</span>
        </li>
        <li>
          <CgProfile className="icon" />
          <span>마이페이지</span>
        </li>
      </ul>
    </div>
  );
}
export default BottomNavbar;
