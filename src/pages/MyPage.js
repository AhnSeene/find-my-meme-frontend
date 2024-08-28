import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Profile from "../components/Profile";
import MyInfo from "../components/MyInfo";
import './mypage.css';

function MyPage(){
    const [activeTab, setActiveTab] = useState('profile');
    const { username } = useParams();
    const { authState } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (username && username !== authState.username) {
            // 다른 사용자의 프로필을 보려는 경우
            // 서버에서 해당 사용자 정보를 가져오는 로직을 추가할 수 있습니다.
            // 필요에 따라 서버 요청이나 다른 로직을 추가합니다.
        } else if (!username && authState.isLoggedIn) {
            // 로그인된 사용자의 마이페이지를 표시
        } else {
            // 로그인되지 않았거나 잘못된 접근일 경우 처리
            // navigate('/login'); // 로그인 페이지로 리다이렉트 등
        }
    }, [username, authState, navigate]);

    const renderContent = () => {
        if (username && username !== authState.username) {
            // 다른 사용자의 프로필을 볼 때는 프로필만 렌더링
            return <Profile username={username}/>;
        }
        
        // 로그인된 사용자의 경우 전체 마이페이지 콘텐츠 렌더링
        switch (activeTab) {
            case 'profile':
                return <Profile username={username}/>;
            case 'myInfo':
                return <MyInfo />;
            case 'postManagement':
                return <div>게시글 관리 컴포넌트</div>;
            default:
                return null;
        }
    };

    
    return (
        <div className="mypage">
            {username === authState.username ? (
                <div className="nav-tabs">
                    <button onClick={() => setActiveTab('profile')}>프로필</button>
                    <button onClick={() => setActiveTab('myInfo')}>내 정보</button>
                    <button onClick={() => setActiveTab('postManagement')}>게시글 관리</button>
                </div>
            ) : null}
            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default MyPage;