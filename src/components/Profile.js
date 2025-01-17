import React, { useState, useEffect } from "react";
import "./profile.css"; // 프로필 스타일
import api from "../contexts/api";

function Profile({ username, isOwnProfile }) {
  const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
  const [profileImage, setProfileImage] = useState(""); //서버에서 가져온 프로필 사진
  const [previewImage, setPreviewImage] = useState(null); // 미리보기 URL
  const [isEditing, setIsEditing] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null); // 새로 선택한 파일

  // 사용자 프로필 사진 불러오기
  useEffect(() => {
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
  }, [username]);

  // 프로필 사진 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // 미리보기 URL 설정
    }
  };

  // 프로필 사진 업로드 핸들러
  const handleUpload = async () => {
    if (!newProfileImage) return;

    try {
      const formData = new FormData();
      formData.append("file", newProfileImage); // 파일을 FormData에 첨부
      console.log(formData);
      const response = await api.uploadProfileImage(formData); // API 호출로 서버에 업로드
      setProfileImage(response.data.profileImageUrl); //업로드 후 프로필 사진 업데이트
      alert("프로필 사진이 업데이트되었습니다.");
      setIsEditing(false);
    } catch (error) {
      console.error("프로필 사진 업로드 실패:", error);
    }
  };

  const follow = () => {
    console.log("팔로우 버튼");
  };

  return (
    <div className="profile">
      <div className="profile-image">
        {isEditing ? (
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <img
              src={previewImage || `${fileBaseUrl}${profileImage}`} // 미리보기 URL 우선 표시, 없으면 서버 URL 표시
              alt="Profile Preview"
            />
            <button onClick={handleUpload}>저장</button>
            <button
              onClick={() => {
                setIsEditing(false);
                setPreviewImage(null); // 미리보기 초기화
                setNewProfileImage(null); // 선택한 파일 초기화
              }}
            >
              취소
            </button>
          </div>
        ) : (
          <>
            <img src={`${fileBaseUrl}${profileImage}`} alt="Profile" />
            {isOwnProfile && (
              <button
                onClick={() => {
                  console.log("Editing mode enabled");
                  setIsEditing(true);
                }}
              >
                수정하기
              </button>
            )}
          </>
        )}
      </div>
      <div className="profile-follow">
        <div>팔로잉</div>
        <div>팔로워</div>
      </div>
    </div>
  );
}

export default Profile;
