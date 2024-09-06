import { useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
function Navbar(){
    const [search,setSearch] = useState('');

    const handleSearch = () => {
        if(search.trim()) {
            console.log('검색어:', search);
        } else {
            console.log('검색어를 입력하세요');
        }
    }
    return(
        <div className="navbar">
            <ul>
                <li><Link to='/'>모든 표현</Link></li>
                <li><Link to='/topmeme'>인기 표현</Link></li>
                <li><Link to='/findmeme'>내 표현을 찾아줘</Link></li>
            </ul>
            <input 
                className="navbar-input"
                type="text" 
                placeholder="검색어 입력"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />
            <button onClick={handleSearch}>검색</button>
        </div>
    )   
}
export default Navbar;