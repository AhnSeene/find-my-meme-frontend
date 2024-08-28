import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import './Header.css';

function Header (){
    const navigate = useNavigate();
    const { authState, logout } = useAuth();
    
    const handleSignUp = () => {
        navigate('/signup',{replace:true});
    };

    const handleLogin = () => {
        navigate('/login',{ replace:true });
    };

    const handleUpload = () => {
        navigate('/uploadmeme',{ replace:true });
    }

    const handleMyPage = () => {
        if (authState.username) {
            navigate(`/users/${authState.username}`, { replace: true });
        }
    }


    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    return(
        <div className="Header">
            <Link to="/" className="logo-link">
                <h1>로고</h1>
            </Link>
            <div className="nav-buttons">
                {authState.isLoggedIn? (
                    <>
                        <button onClick={handleUpload}>짤등록</button>
                        <div className="nav-dropdown">
                            <button onClick={handleMyPage}>마이페이지</button>
                            <div className="dropdown-menu">
                                <button onClick={handleMyPage}>프로필</button>
                                <button onClick={handleMyPage}>내 정보</button>
                                <button onClick={handleMyPage}>게시글 관리</button>
                                <button onClick={handleLogout}>로그아웃</button>
                            </div>
                        </div>
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