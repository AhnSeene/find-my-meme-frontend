import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import "./Navbar.css";
function Navbar() {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState("/");

  const handleSearch = () => {
    if (search.trim()) {
      console.log("검색어:", search);
    } else {
      console.log("검색어를 입력하세요");
    }
  };

  return (
    <div className="navbar">
      <ul>
        <li
          className={`menu-all ${activeMenu === "/" ? "active-menu" : ""}`}
          onClick={() => {
            setActiveMenu("/");
          }}
        >
          <Link to="/">모든 표현</Link>
        </li>
        <li
          className={`menu-top ${
            activeMenu === "/topmeme" ? "active-menu" : ""
          }`}
          onClick={() => {
            setActiveMenu("/topmeme");
          }}
        >
          <Link to="/topmeme">인기 표현</Link>
        </li>
        <li
          className={`menu-find ${
            activeMenu === "/findmeme" ? "active-menu" : ""
          }`}
          onClick={() => {
            setActiveMenu("/findmeme");
          }}
        >
          <Link to="/findmeme">내 표현을 찾아줘</Link>
        </li>
      </ul>
      <div className="navbar-search">
        <input
          className="navbar-input"
          type="text"
          placeholder="검색어 입력"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch} text="검색" />
      </div>
    </div>
  );
}
export default Navbar;
