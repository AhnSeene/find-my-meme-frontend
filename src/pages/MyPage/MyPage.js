import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import Profile from "../../components/myPage/Profile";
import MyInfo from "../../components/myPage/MyInfo";
import MemeGrid from "../../components/meme/MemeGrid";
import Button from "../../components/common/Button";
import "./MyPage.css";
import useProfileMemesQuery from "../../hooks/useProfileMemesQuery";

function MyPage() {
  const [activeTab, setActiveTab] = useState("myMeme");
  const { username } = useParams();

  const navigate = useNavigate();

  // 현재 페이지가 내 프로필인지 다른 사람의 프로필인지 확인
  const usernameFromStore = useAuthStore((state) => state.username);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const isOwnProfile = usernameFromStore === username;
  const { memes, fetchNextPage, hasNextPage, isLoading } =
    useProfileMemesQuery(username);
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   }
  // }, [isLoggedIn, navigate]);

  const renderContent = () => {
    // 로그인된 사용자의 경우 탭에 따라 콘텐츠 렌더링
    if (isOwnProfile) {
      if (activeTab === "myMeme") {
        return <MemeGrid memes={memes} isProfile={true} username={username} />;
      } else if (activeTab === "myInfo") {
        return <MyInfo />;
      } else if (activeTab === "postManagement") {
        return <div>게시글 관리 컴포넌트</div>;
      }
    } else {
      return <MemeGrid memes={memes} isProfile={true} username={username} />;
    }
  };

  // const follow = () => {
  //   console.log("팔로우하기");
  // };

  return (
    <div className="mypage-page">
      <Profile username={username} isOwnProfile={isOwnProfile} />
      {isOwnProfile && (
        <>
          {/* 로그인된 사용자의 경우 탭 표시 */}
          <div className="nav-tabs">
            <button
              onClick={() => setActiveTab("myMeme")}
              className={activeTab === "myMeme" ? "active" : ""}
            >
              나의 밈
            </button>
            <button
              onClick={() => setActiveTab("myInfo")}
              className={activeTab === "myInfo" ? "active" : ""}
            >
              내 정보
            </button>
            <button
              onClick={() => setActiveTab("postManagement")}
              className={activeTab === "postManagement" ? "active" : ""}
            >
              게시글 관리
            </button>
          </div>
        </>
      )}

      <div className="tab-content">{renderContent()}</div>
    </div>
  );
}

export default MyPage;
