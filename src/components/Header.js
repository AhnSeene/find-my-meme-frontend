import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import './Header.css';

function Header (){
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth(); 
    console.log('isLoggedIn :',isLoggedIn);
    
    const handleSignUp = () => {
        navigate('/signup',{replace:true});
    };

    const handleLogin = () => {
        navigate('/login',{ replace:true });
    };

    const handleUpload = () => {
        navigate('/uploadmeme',{ replace:true });
    }

    return(
        <div className="Header">
            <Link to="/" className="logo-link">
                <h1>로고</h1>
            </Link>
            <div className="nav-buttons">
                {isLoggedIn? (
                    <>
                        <button onClick={handleUpload}>짤등록</button>
                        <button>마이페이지</button>
                    </>
                ):(
                    <>
                        <button onClick={handleSignUp}>회원가입</button>
                        <button onClick={handleLogin}>로그인</button>
                    </>
                )}
            </div>
        </div>
    )
}
export default Header;