import { useState, useEffect } from "react";
import { useParams, Link  } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import { SiKakaotalk } from "react-icons/si";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { GoHeart, GoHeartFill } from "react-icons/go";
import MemeSwiper from "../components/MemeSwiper";
import { useAuth } from "../contexts/AuthContext";
import api from "../contexts/api";
import './memedetail.css';

function MemeDetail(){
    const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
    const { authState } = useAuth();
    const {id} = useParams();
    const [meme, setMeme] = useState(null);
    const [recommendedMemes, setRecommendedMemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchMeme = async () => {
            try{
                const response= await api.get(`/meme-posts/${id}`);
                setMeme(response.data.data);
                setLoading(false);
            } catch(error){
                setError('Failed to load meme details.',error);
                setLoading(false);
            }
        };

        const fetchRecommendedMemes = async () => {
            try{
                const response = await api.get(`/meme-posts/${id}/recommendations`);
                setRecommendedMemes(response.data.data);
            } catch(error) {
                console.error(`Filed to load recommended memes:`,error);
            }
        }
        fetchMeme();
        fetchRecommendedMemes();
    },[id]);
    
    if (loading) return <div>Loadding...</div>;
    if (error) return <div>{Error}</div>

    const handleDownload = async () => {
        const imageUrl = `${fileBaseUrl}${meme.imageUrl}`;
        try {
            const response = await fetch(imageUrl, { mode: 'cors' });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = meme.originalFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Image download failed:', error);
        }
    };

    const handleLikeToggle = async () => {
        if (!meme) return;
    
        // UI를 먼저 업데이트
        const newIsLiked = !meme.isLiked;
        const newLikeCount = newIsLiked ? meme.likeCount + 1 : meme.likeCount - 1;
    
        setMeme(prevMeme => ({
            ...prevMeme,
            isLiked: newIsLiked,
            likeCount: newLikeCount,
        }));
    
        try {
            // 서버 요청
            const response = await api.post(`/meme-posts/${id}/toggleLike`);
            const { isLiked } = response.data.data;
    
            // 서버 응답에 따라 상태 동기화
            setMeme(prevMeme => ({
                ...prevMeme,
                isLiked
            }));
        } catch (error) {
            console.error('Failed to toggle like:', error);
    
            // 에러 발생 시 UI 상태 원복
            setMeme(prevMeme => ({
                ...prevMeme,
                isLiked: !newIsLiked,
                likeCount: newLikeCount,
            }));
        }
    };
    

    function shareOnKakao() {
        const imageUrl = `${fileBaseUrl}${meme.imageUrl}`;
        // 카카오톡 공유 API를 사용하여 이미지 공유 (사전 설정 필요)
        window.Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: 'Check out this meme!',
                description: 'Funny meme to share.',
                imageUrl: imageUrl,
                link: {
                    mobileWebUrl: imageUrl,
                    webUrl: imageUrl,
                },
            },
        });
    }

    function shareOnTwitter() {
        const imageUrl = `${fileBaseUrl}${meme.imageUrl}`;
        const shareText = `Check out this meme!`;
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(imageUrl)}`;
        window.open(shareUrl, '_blank');
    }
    
    function copyLink() {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Failed to copy link: ', err));
    }
    
    return(
        <div className="memedetail">
            <div className="memedetail-info">
                <div className="memedetail-left">
                    <img src={`${fileBaseUrl}${meme.imageUrl}`} alt ={`Meme ${meme.id}`}/>
                    <div className="memedetail-left-info">
                        <Link to={`/users/${meme.username}`} className="memedetail-link">
                            <img src={`${fileBaseUrl}${meme.userProfileImageUrl}`} alt={`${meme.id}img`}></img>
                            <span>{meme.username} </span> 
                        </Link>
                        <button onClick={handleLikeToggle}>
                            {meme.isLiked ? (
                                <GoHeartFill style={{ fontSize: '24px', color: 'red' }} />
                            ) : (
                                <GoHeart style={{ fontSize: '24px' }} />
                            )}
                        </button>
                        {meme.likeCount}
                    </div>
                </div>
                <div className="memedetail-right">
                    <div>weight x height : {meme.weight} x {meme.height}</div>
                    <div>size : {meme.size}</div>
                    <button className="download-btn" onClick={handleDownload}><MdDownload />다운로드</button>
                    <div className="share-menu">
                        <button onClick={shareOnKakao}><SiKakaotalk /></button>
                        <button onClick={shareOnTwitter}><FaSquareXTwitter /></button>
                        <button><FaFacebookSquare /></button>
                        <button onClick={copyLink}><FaLink /></button>
                    </div>
                    <div className="memedetail-tags">
                        {meme.tags.map((tag,index)=>(
                            <span key={index} className="memedetail-tag"># {tag}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="recommend-meme">
                <MemeSwiper memes={recommendedMemes}/>
            </div>
        </div>
    )
}
export default MemeDetail;