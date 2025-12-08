import React, { useState, useEffect } from "react";
import "./profile.css";
import api from "../../contexts/api";
import { FiPlusCircle } from "react-icons/fi";
import useAuthStore from "../../store/useAuthStore";

function Profile({ username, isOwnProfile }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [profileImage, setProfileImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);

  // 사용자 프로필 정보 불러오기
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/meme-posts/users/${username}`);
        const imageUrl = response.data.data.user.profileImageUrl;
        setProfileImage(imageUrl);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [username, isLoggedIn]);

  // 프로필 사진 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  // 프로필 사진 업로드 핸들러
  const handleUpload = async () => {
    if (!newProfileImage) return;

    try {
      const formData = new FormData();
      formData.append("file", newProfileImage);
      const response = await api.uploadProfileImage(formData);
      setProfileImage(response.data.profileImageUrl);
      alert("프로필 사진이 업데이트되었습니다.");
      setIsEditing(false);
      setPreviewImage(null);
      setNewProfileImage(null);
    } catch (error) {
      console.error("프로필 사진 업로드 실패:", error);
      alert("프로필 사진 업로드에 실패했습니다.");
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setNewProfileImage(null);
  };

  const handleFollow = () => {
    console.log("팔로우 버튼 클릭");
    // 팔로우 API 호출
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-background"></div>

      <div className="profile">
        {/* 상단 배너 */}
        <div className="profile-banner"></div>

        {/* 프로필 컨텐츠 */}
        <div className="profile-content">
          {/* 프로필 이미지 섹션 */}
          <div className="profile-image-section">
            <div className="profile-image">
              <img
                src={previewImage || profileImage}
                alt={`${username}'s profile`}
              />
              {isOwnProfile && !isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                  <button
                    className="edit-icon"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <FiPlusCircle size={48} />
                  </button>
                </>
              )}
            </div>

            {/* 편집 모드 버튼 */}
            {isEditing && (
              <div className="profile-image-edit">
                <button onClick={handleUpload}>저장</button>
                <button onClick={handleCancel}>취소</button>
              </div>
            )}
          </div>

          {/* 프로필 정보 */}
          <div className="profile-info">
            <div className="profile-header">
              <h1 className="profile-username">{username}</h1>

              {!isOwnProfile && (
                <button
                  className="profile-follow-button"
                  onClick={handleFollow}
                >
                  팔로우
                </button>
              )}
            </div>

            {/* 바이오 (선택사항 - 데이터가 있으면 표시) */}
            {/* <div className="profile-bio">
              안녕하세요! 재미있는 밈을 공유하는 것을 좋아합니다 🎨
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
