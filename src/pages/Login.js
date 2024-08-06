import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login (){
    const [id, setId] = useState('');
    const [password,setPassword] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit=(e)=>{
        e.preventDefault();

        login(); //로그인상태로 변경
        
        console.log('아이디 :',id);
        console.log('비밀번호 :',password);
        navigate('/',{ replace:true });
    }
    return(
        <div className="Login">
            <form className="LoginForm" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">아이디</label>
                    <input
                        id="id"
                        type="text"
                        value={id}
                        onChange={(e)=>setId(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">로그인</button>
            </form>
        </div>
    )
}
export default Login;