import { useState, useEffect, useRef } from 'react';
import api from '../contexts/api';
import { AiFillLike } from "react-icons/ai";
import { GrFormView } from "react-icons/gr";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { Link } from 'react-router-dom';
import { BiEditAlt } from "react-icons/bi";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { IoMdDownload } from "react-icons/io";
import { useAuth } from '../contexts/AuthContext';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"; 
import './profile.css'; // Import CSS for styling

function Profile({username}) {
    const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
    const { authState } = useAuth();
    const [profilePic, setProfilePic] = useState('');
    const [originalProfilePic, setOriginalProfilePic] = useState(''); // 저장된 원본 프로필 사진 URL
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [memes, setMemes] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get(`/meme-posts/users/${username}`);
                setProfilePic(response.data.data.user.profileImageUrl);
                setOriginalProfilePic(response.data.data.user.profileImageUrl); // 원본 프로필 사진 URL 저장
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserProfile();
    }, [username]);

    useEffect(() => {
        loadMemes();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page]);

    const loadMemes = async () => {
        if (loading || !hasNext) return;
    
        setLoading(true);
        try {
            const response = await api.get(`/meme-posts/users/${username}?page=${page}&size=5`);
            const memePosts = response.data.data.memePosts;
            const newMemes = memePosts.content;
            setMemes(prevMemes => [...prevMemes, ...newMemes]);
            setHasNext(memePosts.hasNext);
        } catch (error) {
            console.error('Failed to load memes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.offsetHeight && hasNext) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const toggleLike = async (event, memeId) => {
        event.stopPropagation();
        
        // 먼저 UI에 반영
        const updatedMemes = memes.map(meme => {
            if (meme.id === memeId) {
                const isLiked = !meme.isLiked;
                const likeCount = isLiked ? meme.likeCount + 1 : meme.likeCount - 1;
                return { ...meme, isLiked, likeCount };
            }
            return meme;
        });

        setMemes(updatedMemes);

        try {
            const response = await api.post(`/meme-posts/${memeId}/toggleLike`);

            const { isLiked } = response.data.data;
            // 서버 응답에 따라 likeCount를 조정하지 않고 상태만 동기화
            setMemes(prevMemes =>
                prevMemes.map(meme =>
                    meme.id === memeId
                        ? { ...meme, isLiked }
                        : meme
                )
            );

        } catch (error) {
            console.error('Failed to toggle like:', error);
            // 에러 발생 시 상태 원복
            setMemes(prevMemes => memes);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImageClick = () => {
        if (!isEditing) return;
        fileInputRef.current.click();
    };

    const handleEditIconClick = () => {
        fileInputRef.current.click();
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await api.post('/users/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Fetch updated profile information
            const response = await api.get(`/meme-posts/users/${username}`);
            setProfilePic(response.data.data.user.profileImageUrl);
            setSelectedFile(null);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedFile(null); // 선택된 파일 초기화
        setProfilePic(originalProfilePic); // 원래의 프로필 사진으로 복원
    };

    const isOwnProfile = username === authState.username;

    return (
        <>
        <div className="profile">
            <div className={`profile-image-container ${isEditing ? 'overlay-active' : ''}`}>
                <img
                    src={selectedFile ? URL.createObjectURL(selectedFile) : `${fileBaseUrl}${profilePic}?t=${new Date().getTime()}`}
                    alt={`${username}'s profile picture`}
                    onClick={handleImageClick}
                />
                <div className="edit-icon">
                    <BsFillPlusCircleFill />
                </div>
                <div className="edit-icon-bottom" onClick={handleEditIconClick}>
                    <BiEditAlt />
                </div>
            </div>
            <div>{username}</div>
            {isOwnProfile ? (
                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="cancel">
                                Cancel
                            </button>
                            <button onClick={handleUpload} className="upload">
                                Upload
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                    )}
                </div>
            ) : null}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
        </div>
        <div className='meme-list'>
        <ResponsiveMasonry columnsCountBreakPoints={{ 425: 2, 750: 3, 1200: 4 }}>
                <Masonry gutter="20px">
                    {memes.map((meme, index) => (
                        <div key={meme.id} className="meme-item">
                            <div className="meme-image-container">
                                <Link to={`/meme/${meme.id}`}>
                                    <img src={`${fileBaseUrl}${meme.imageUrl}`} alt={`Meme ${index}`} />
                                    <div className="overlay">
                                        <div className="meme-info">
                                            <GoHeartFill style={{ fontSize: '20px' }} /> {meme.likeCount}
                                            <GrFormView style={{ fontSize: '30px' }} /> {meme.viewCount}
                                            <IoMdDownload style={{ fontSize: '24px' }} /> {meme.downloadCount}
                                        </div>
                                        <div className="meme-tags">
                                            {meme.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="meme-tag">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                                <button onClick={(e) => toggleLike(e, meme.id)}>
                                    {meme.isLiked ? (
                                        <GoHeartFill style={{ fontSize: '30px', color: 'red' }} />
                                    ) : (
                                        <GoHeart style={{ fontSize: '30px' }} />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
            </Masonry>
        </ResponsiveMasonry>
        {loading && <p>Loading...</p>}
        {!hasNext && <p>No more memes</p>}
    </div>
    </>
    );
}

export default Profile;
