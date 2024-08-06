import { Link } from "react-router-dom";
import './Navbar.css';
function Navbar(){
    return(
        <div className="navbar">
            <ul>
                <li><Link to='/'>모든 표현</Link></li>
                <li><Link to='/'>이번주 Top</Link></li>
                <li><Link to='/findmeme'>내 표현을 찾아줘</Link></li>
            </ul>
        </div>
    )   
}
export default Navbar;