import React, { useState, useEffect } from "react";
import "./profile.css";
import api from "../../contexts/api";
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import useAuthStore from "../../store/useAuthStore";

function Profile({ username, isOwnProfile }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [profileImage, setProfileImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (previewImage) URL.revokeObjectURL(previewImage);
      setNewProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  const handleUpload = async () => {
    if (!newProfileImage) return;

    try {
      const formData = new FormData();
      formData.append("file", newProfileImage);
      const response = await api.uploadProfileImage(formData);
      setProfileImage(response.data.profileImageUrl);
      toast.success("프로필 사진이 업데이트되었습니다.");
      setIsEditing(false);
      if (previewImage) URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
      setNewProfileImage(null);
    } catch (error) {
      console.error("프로필 사진 업로드 실패:", error);
      toast.error("프로필 사진 업로드에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
    setNewProfileImage(null);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-background"></div>

      <div className="profile">
        <div className="profile-banner"></div>

        <div className="profile-content">
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

            {isEditing && (
              <div className="profile-image-edit">
                <button onClick={handleUpload}>저장</button>
                <button onClick={handleCancel}>취소</button>
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="profile-header">
              <h1 className="profile-username">{username}</h1>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
