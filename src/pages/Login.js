import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../contexts/api";
import './Login.css';

function Login () {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();  // login 함수 가져오기
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/login', {
                username: id,
                password: password,
            });

            console.log(response.data.data); 

            if (response.status === 200) {
                const token = response.data.data.accessToken;
                const username = response.data.data.username;  // 서버 응답에서 username 가져오기

                // login 함수를 사용해 AuthContext에 token과 username을 저장
                login(token, username);

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
                <div>
                    <label htmlFor="id">아이디</label>
                    <input
                        id="id"
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}

export default Login;
