import { useState } from "react";
import Profile from "../components/Profile";
import './mypage.css';

function MyPage(){
    const [activeTab, setActiveTab] = useState('profile');
    
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <Profile userId={123} />;
            case 'myInfo':
                return <div>내 정보 관리 컴포넌트</div>;
            case 'postManagement':
                return <div>게시글 관리 컴포넌트</div>;
            default:
                return null;
        }
    }
    
    return(
        <div className="mypage">
            <div className="nav-tabs">
                <button onClick={() => setActiveTab('profile')}>프로필</button>
                <button onClick={() => setActiveTab('myInfo')}>내 정보</button>
                <button onClick={() => setActiveTab('postManagement')}>게시글 관리</button>
            </div>
            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    )
}
export default MyPage;