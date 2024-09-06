import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillLike } from "react-icons/ai";
import { GrFormView } from "react-icons/gr";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoMdDownload } from "react-icons/io";
import { useAuth } from '../contexts/AuthContext';
import TagSelector from '../components/TagSelector';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"; 
import api from '../contexts/api';
import './home.css';

function Home() {
    const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
    const { authState } = useAuth();
    const [memes, setMemes] = useState([]);
    const [page, setPage] = useState(0);
    const [selectedSubTags, setSelectedSubTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);

    useEffect(() => {
        loadMemes();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page]);

    const loadMemes = async () => {
        if (loading || !hasNext) return;
    
        setLoading(true);
        try {
            const response = await api.get(`/meme-posts?page=${page}&size=5`);
            const newMemes = response.data.data.content;
            setMemes(prevMemes => [...prevMemes, ...newMemes]);
            setHasNext(response.data.data.hasNext);
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
            const response = await api.post(`/meme-posts/${memeId}/toggleLike`, {}, {
                headers: {
                    Authorization: `Bearer ${authState.token}`
                }
            });

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

    return (
        <div className='home'>
            <TagSelector 
                selectedSubTags={selectedSubTags} 
                setSelectedSubTags={setSelectedSubTags} 
            />
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
    );
}

export default Home;
