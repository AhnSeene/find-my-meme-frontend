import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { IoMdCloseCircle } from "react-icons/io";
import api from "../contexts/api";
import './Login.css';

function Login () {
    const [id, setId] = useState('');
    const [rememberId, setRememberId] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();  // login 함수 가져오기
    const navigate = useNavigate();

    useEffect(() => {
        // 로컬 스토리지에서 아이디와 체크박스 상태를 로드
        const savedId = localStorage.getItem('savedId');
        const isRemembered = localStorage.getItem('rememberId') === 'true'; // 'true' 문자열을 불러옴
    
        if (savedId) {
            setId(savedId);
        }
        setRememberId(isRemembered);
    }, []);
    
    const resetId = () => setId('');
    const togglePwShow = () => setShowPassword(prevState => !prevState);
    const handleRememberId = () => setRememberId(prevState => !prevState);
    const handleSignUp = () => navigate('/signup');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/login', {
                username: id,
                password: password,
            });

            if (response.status === 200) {
                const token = response.data.data.accessToken;
                const username = response.data.data.username;  // 서버 응답에서 username 가져오기

                // login 함수를 사용해 AuthContext에 token과 username을 저장
                login(token, username);

                if (rememberId) {
                    localStorage.setItem('savedId', id); // 아이디 저장
                } else {
                    localStorage.removeItem('savedId'); // 아이디 제거
                }
                localStorage.setItem('rememberId', JSON.stringify(rememberId)); // 체크박스 상태 저장

                navigate('/', { replace: true });
            } else {
                console.error('로그인 실패:', response.status);
            }
        } catch (error) {
            console.error('로그인 오류:', error);
        }
    };

    return (
        <div className="Login">
            <form className="LoginForm" onSubmit={handleSubmit}>
                <div style={{position:'relative'}}>
                    <input
                        id="id"
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="아이디"
                    />
                    <span
                        onClick={resetId}
                        style={{
                            position:'absolute',
                            right: '10px', 
                            top: '54%', 
                            transform: 'translateY(-50%)',
                            cursor:'pointer'
                        }}
                    >
                        <IoMdCloseCircle />
                    </span>
                </div>
                <div style={{position:'relative'}}>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                    />
                    <span
                        onClick={togglePwShow}
                        style={{
                            position:'absolute',
                            right: '10px', 
                            top: '52%', 
                            transform: 'translateY(-50%)',
                            cursor:'pointer'
                        }}
                    >
                        {showPassword ? <BiShow/>:<BiHide/>}
                    </span>
                </div>
                <div className="remember-me">
                    <label htmlFor="rememberId">아이디 저장</label>
                    <input
                        type="checkbox"
                        className="rememberId-checkbox"
                        checked={rememberId}
                        onChange={handleRememberId}
                    />
                </div>
                
                <div className="signup-container">
                    계정이 없으신가요? 
                    <button 
                        type="button" 
                        className="signup-button" 
                        onClick={handleSignUp}
                    >
                        회원가입
                    </button>
                </div>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}

export default Login;
