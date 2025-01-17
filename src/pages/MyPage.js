import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Profile from "../components/Profile";
import MyInfo from "../components/MyInfo";
import MemeGrid from "../components/MemeGrid";
import useToggleLike from "../hooks/useToggleLike";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import Button from "../components/Button";
import "./mypage.css";

function MyPage() {
  const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
  const [activeTab, setActiveTab] = useState("myMeme");
  const { username } = useParams();
  const { authState } = useAuth();
  const navigate = useNavigate();

  // 현재 페이지가 내 프로필인지 다른 사람의 프로필인지 확인
  const isOwnProfile = authState.username === username;
  console.log("로그인된 계정", authState.username);
  console.log("지금 user", username);
  console.log(isOwnProfile);
  const { memes, setMemes, loading, hasNext, setPage } = useInfiniteScroll(
    [],
    true, //isProfile이 true일 때 해당 계정이 올린 밈을 가져옴
    username
  );
  const toggleLike = useToggleLike(memes, setMemes, authState);

  useEffect(() => {
    if (!username && authState.isLoggedIn) {
      navigate("/login");
    }
  }, []);

  const renderContent = () => {
    // 로그인된 사용자의 경우 탭에 따라 콘텐츠 렌더링
    if (isOwnProfile) {
      if (activeTab === "myMeme") {
        return (
          <MemeGrid
            memes={memes}
            toggleLike={toggleLike}
            fileBaseUrl={fileBaseUrl}
          />
        );
      } else if (activeTab === "myInfo") {
        return <MyInfo />;
      } else if (activeTab === "postManagement") {
        return <div>게시글 관리 컴포넌트</div>;
      }
    } else {
      return (
        <MemeGrid
          memes={memes}
          toggleLike={toggleLike}
          fileBaseUrl={fileBaseUrl}
        />
      );
    }
  };

  const follow = () => {
    console.log("팔로우하기");
  };

  return (
    <div className="mypage">
      <Profile username={username} isOwnProfile={isOwnProfile} />
      {username === authState.username ? (
        <>
          {/* 로그인된 사용자의 경우 탭 표시 */}
          <div className="nav-tabs">
            <button onClick={() => setActiveTab("myMeme")}>나의 밈</button>
            <button onClick={() => setActiveTab("myInfo")}>내 정보</button>
            <button onClick={() => setActiveTab("postManagement")}>
              게시글 관리
            </button>
          </div>
        </>
      ) : (
        <div>
          <Button text={"팔로우하기"} onClick={follow()} />
        </div>
      )}
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
}

export default MyPage;
