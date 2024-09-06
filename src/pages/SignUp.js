import { useState } from "react";
import { useNavigate } from "react-router";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { IoMdCloseCircle } from "react-icons/io";
import Modal from 'react-modal';
import api from "../contexts/api";
import './signup.css'
import { Navigation } from "swiper/modules";

function SignUp(){
    const navigate = useNavigate();

    const [formData,setFormData] = useState({
        id: '',
        password:'',
        confirmPassword:'',
        email:''
    });

    const [errors,setErrors] = useState({
        id:'',
        password:'',
        confirmPassword:'',
        email:''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSignupModal, setIsSignupModal] = useState(false);
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);  // 비밀번호 보기 상태 관리
    const [showPwConfirm, setShowPwConfirm] = useState(false);

    const togglePwShow = () => setShowPassword(prevState => !prevState);
    const togglePwConfirmShow = () => setShowPwConfirm(prevState => !prevState);

    const resetId = () => {
        setFormData(prevData => ({ ...prevData, id: '' }));
        setIsIdChecked(false)
    }
    const resetEmail = () => setFormData(prevData => ({ ...prevData, email: '' }));

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

            case 'email':
                if (!value) {
                    error = '이메일을 입력하세요';
                } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
                    error = '유효한 이메일 주소를 입력하세요';
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

    const handleIdCheck = async (e)=>{
        e.preventDefault();
        const {id} = formData;
        
        try{
            const response = await api.post('/users/check-username', {
                username: id 
            });

            if(response.data.success){
                setModalMessage('사용 가능한 아이디입니다.');
                setIsModalOpen(true);  // 모달창 열기
                setIsIdChecked(true);  // 중복검사 통과
            }
            else{
                setModalMessage('이미 사용중인 아이디입니다.');
                setIsModalOpen(true);
                setIsIdChecked(false);  // 중복검사 통과
            }
        }catch(error){
            console.error('아이디 중복검사 실패', error);
            setModalMessage('중복 검사 중 오류가 발생했습니다.');
            setIsModalOpen(true);
            setIsIdChecked(false);  // 중복검사 통과
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);  // 모달창 닫기
    };

    const handleLogin = () => {
        setIsSignupModal(false);
        navigate(`/login`);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isIdChecked) {
            setModalMessage('아이디 중복검사를 통과해야 합니다.');
            setIsModalOpen(true);
            return;
        }

        //전체 폼 데이터 유효성 검사
        const newErrors = {
            id: validate('id', formData.id),
            password: validate('password', formData.password),
            confirmPassword: validate('confirmPassword', formData.confirmPassword),
            email: validate('email', formData.email)
        };

        if(Object.values(newErrors).some(error => error)) {
            setErrors(newErrors);
            return;
        }

        try{
            const {id, password,email} = formData; //필요한 데이터만 추출하여 서버에 보냄
            const response = await api.post('/signup',{
                username:id,
                password,
                email
            });
            console.log('회원가입 성공!', response.data);
            setModalMessage('회원가입을 완료하였습니다!');
            setIsSignupModal(true)
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
                    <div style={{position:'relative'}}>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="아이디"
                            required
                        />
                        <span
                            onClick={resetId}
                            style={{
                                position:'absolute',
                                right: '100px', 
                                top: '46%', 
                                transform: 'translateY(-50%)',
                                cursor:'pointer'
                            }}
                        >
                            <IoMdCloseCircle />
                        </span>
                    </div>
                    <button
                        type="button" 
                        onClick={handleIdCheck}
                        disabled={isIdChecked}
                    >
                        중복검사
                    </button>
                    {errors.id && <p className="error">{errors.id}</p>}
                </div>

                <Modal
                    isOpen={isModalOpen && !isSignupModal}
                    onRequestClose={closeModal}
                    contentLabel="아이디 중복 확인"
                    className="Modal"
                    overlayClassName="Overlay"
                >
                    <p>{modalMessage}</p>
                    <button onClick={closeModal}>확인</button>
                </Modal>

                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <div style={{position:'relative'}}>
                        <input
                            type={showPassword? "text":"password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호"
                            required
                        />
                        <span
                            onClick={togglePwShow}
                            style={{
                                position:'absolute',
                                right: '100px', 
                                top: '46%', 
                                transform: 'translateY(-50%)',
                                cursor:'pointer'
                            }}
                        >
                            {showPassword ? <BiShow/>:<BiHide/>}
                        </span>
                    </div>
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <div style={{position:'relative'}}>
                        <input
                            type={showPwConfirm? "text":"password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="비밀번호 확인"
                            required
                        />
                        <span
                            onClick={togglePwConfirmShow}
                            style={{
                                position:'absolute',
                                right: '100px', 
                                top: '46%', 
                                transform: 'translateY(-50%)',
                                cursor:'pointer'
                            }}
                        >
                            {showPwConfirm ? <BiShow/>:<BiHide/>}
                        </span>
                    </div>
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <div style={{position:'relative'}}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일"
                            required
                        />
                        <span
                            onClick={resetEmail}
                            style={{
                                position:'absolute',
                                right: '100px', 
                                top: '46%', 
                                transform: 'translateY(-50%)',
                                cursor:'pointer'
                            }}
                        >
                            <IoMdCloseCircle />
                        </span>
                    </div>
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <button className="signup-btn" type="submit">회원가입</button>
                <Modal
                    isOpen={isSignupModal}
                    onRequestClose={handleLogin}
                    contentLabel="회원가입 성공 여부"
                    className="Modal"
                    overlayClassName="Overlay"
                >
                    <p>{modalMessage}</p>
                    <button onClick={handleLogin}>로그인하러가기</button>
                </Modal>
            </form>
        </div>
    )
}
export default SignUp;