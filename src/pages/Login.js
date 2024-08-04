import { useState } from "react";
import './Login.css';

function Login (){
    const [id, setId] = useState('');
    const [password,setPassword] = useState('');

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log('아이디 :',id);
        console.log('비밀번호 :',password);
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