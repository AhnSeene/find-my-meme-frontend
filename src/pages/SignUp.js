import { useState } from "react";
import axios from "axios";
import './signup.css';
import { useNavigate } from "react-router";

function SignUp(){
    const navigate = useNavigate();

    const [formData,setFormData] = useState({
        id: '',
        password:'',
        confirmPassword:''
    });

    const [errors,setErrors] = useState({
        id:'',
        password:'',
        confirmPassword:''
    });

    const validate = (name,value)=> {
        let error='';

        switch(name){
            case 'id':
                if(!value){
                    error = '아이디를 입력하세요';
                } else if(!/^[a-z0-9]{5,20}$/.test(value)) {
                    error = '아이디 : 5~20자의 영문 소문자, 숫자만 가능합니다';
                }
                break;

            case 'password':
                if(!value){
                    error = '비밀번호를 입력하세요';
                } else if(!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(value)){
                    error='비밀번호: 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해주세요';
                }
                break;
            
            case 'confirmPassword':
                if(value !== formData.password){
                    error = '비밀번호가 일치하지 않습니다'
                }
                break;
            
            default:
                break;
        }
        return error;
    }

    const handleChange = (e)=> {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        //실시간 유효성 검사
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: validate(name,value)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //전체 폼 데이터 유효성 검사
        const newErrors = {
            id: validate('id', formData.id),
            password: validate('password', formData.password),
            confirmPassword: validate('confirmPassword', formData.confirmPassword)
        };

        if(Object.values(newErrors).some(error => error)) {
            setErrors(newErrors);
            return;
        }

        try{
            const {id, password} = formData; //필요한 데이터만 추출하여 서버에 보냄
            const response = await axios.post('api/register',id,password);
            console.log('회원가입 성공!', response.data);

            navigate('/login',{replace:true});
        } catch(error){
            console.error('회원가입 실패', error);
        }
    }

    return(
        <div className="signup">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}> 
                <div className="form-group">
                    <label htmlFor="id">아이디</label>
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="아이디"
                        required
                    />
                    {errors.id && <p className="error">{errors.id}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호"
                        required
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="비밀번호 확인"
                        required
                    />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </div>

                <button type="submit">회원가입</button>
            </form>
        </div>
    )
}
export default SignUp;