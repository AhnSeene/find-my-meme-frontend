import { useState, useEffect } from "react";
import { FiUser, FiMail, FiEdit2, FiKey } from "react-icons/fi";
import api from "../../contexts/api";
import "./MyInfo.css";

function MyInfo() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`/users/me`);
        if (response.data.success) {
          setUsername(response.data.data.username);
          setEmail(response.data.data.email);
        } else {
          throw new Error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("MyInfo 데이터 불러오기 실패", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditProfile = () => {
  };

  const handleChangePassword = () => {
  };

  if (loading) {
    return (
      <div className="myinfo-loading">
        <div className="spinner"></div>
        <p>로딩중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myinfo-error">
        <div className="error-icon">⚠️</div>
        <h3>오류가 발생했습니다</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="myinfo">
      <div className="myinfo-header">
        <h2>내 정보</h2>
        <p className="myinfo-subtitle">계정 정보를 확인하고 관리하세요</p>
      </div>

      <div className="info-card">
        <div className="info-card-header">
          <h3>기본 정보</h3>
          <button className="edit-btn-small" onClick={handleEditProfile}>
            <FiEdit2 />
            편집
          </button>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <FiUser />
          </div>
          <div className="info-content">
            <label>사용자 이름</label>
            <p>{username}</p>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <FiMail />
          </div>
          <div className="info-content">
            <label>이메일</label>
            <p>{email}</p>
          </div>
        </div>
      </div>

      <div className="info-card">
        <div className="info-card-header">
          <h3>보안</h3>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <FiKey />
          </div>
          <div className="info-content">
            <label>비밀번호</label>
            <p>••••••••</p>
          </div>
          <button
            className="change-password-btn"
            onClick={handleChangePassword}
          >
            변경
          </button>
        </div>
      </div>

      <div className="info-card danger">
        <div className="info-card-header">
          <h3>계정 관리</h3>
        </div>

        <div className="danger-zone">
          <div className="danger-info">
            <h4>계정 삭제</h4>
            <p>계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
          </div>
          <button className="danger-btn">계정 삭제</button>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;
