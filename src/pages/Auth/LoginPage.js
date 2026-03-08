import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { IoMdCloseCircle } from "react-icons/io";
import Button from "../../components/common/Button";
import api from "../../contexts/api";
import Modal from "react-modal";
import useAuthStore from "../../store/useAuthStore";
import "./LoginPage.css";

function LoginPage() {
  const [id, setId] = useState("");
  const [rememberId, setRememberId] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const savedId = localStorage.getItem("savedId");
    const isRemembered = localStorage.getItem("rememberId") === "true";

    if (savedId) {
      setId(savedId);
    }
    setRememberId(isRemembered);
  }, []);

  const resetId = () => setId("");
  const togglePwShow = () => setShowPassword((prevState) => !prevState);
  const handleRememberId = () => setRememberId((prevState) => !prevState);
  const handleSignUp = () => navigate("/signup");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        username: id,
        password: password,
      });

      if (response.status === 200) {
        const token = response.data.data.accessToken;
        const username = response.data.data.username;
        login(token, username);

        if (rememberId) {
          localStorage.setItem("savedId", id);
          localStorage.setItem("rememberId", JSON.stringify(rememberId));
        } else {
          localStorage.removeItem("savedId");
          localStorage.removeItem("rememberId");
        }

        navigate("/", { replace: true });
      }
    } catch (error) {
      if (
        error.response?.status === 401 &&
        error.response?.data?.code === "AUTH_INVALID_ID_CREDENTIALS"
      ) {
        setErrorMessage(error.response?.data?.message);
      } else {
        setErrorMessage(error.response?.data?.message);
      }
      setIsModalOpen(true);

      console.error("로그인 오류:", error);
    }
  };

  return (
    <div className="Login">
      <form className="LoginForm" onSubmit={handleSubmit}>
        <div style={{ position: "relative" }}>
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
              position: "absolute",
              right: "10px",
              top: "54%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            <IoMdCloseCircle />
          </span>
        </div>
        <div style={{ position: "relative" }}>
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
              position: "absolute",
              right: "10px",
              top: "52%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPassword ? <BiShow /> : <BiHide />}
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
        <Button text="로그인" type="submit" className="login-button" />
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="로그인 오류"
        className="Modal"
        overlayClassName="Overlay"
        appElement={document.getElementById("root")}
      >
        <p>{errorMessage}</p>
        <Button text={"확인"} onClick={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default LoginPage;
