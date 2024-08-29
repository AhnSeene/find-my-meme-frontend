import { Link } from "react-router-dom";
import './Navbar.css';
function Navbar(){
    return(
        <div className="navbar">
            <ul>
                <li><Link to='/'>ALL MEME</Link></li>
                <li><Link to='/topmeme'>Top MEME</Link></li>
                <li><Link to='/findmeme'>Find MEME</Link></li>
            </ul>
        </div>
    )   
}
export default Navbar;