import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import { SiKakaotalk } from "react-icons/si";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { GrFormView } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import MemeSwiper from "../../components/meme/MemeSwiper";
import { toast } from "react-toastify";
import api from "../../contexts/api";
import ResponsiveImage from "../../components/common/ResponsiveImage";
import "./MemeDetailPage.css";

function MemeDetailPage() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const [meme, setMeme] = useState(null);
  const [recommendedMemes, setRecommendedMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const response = await api.get(`/meme-posts/${id}`);
        setMeme(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load meme details.", error);
        setLoading(false);
      }
    };

    const fetchRecommendedMemes = async () => {
      try {
        const response = await api.get(`/meme-posts/${id}/recommendations`);
        setRecommendedMemes(response.data.data);
      } catch (error) {
        console.error(`Failed to load recommended memes:`, error);
      }
    };
    fetchMeme();
    fetchRecommendedMemes();
  }, [id]);

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>로딩중...</p>
      </div>
    );
  if (error) return <div className="error-message">{error}</div>;

  const handleDownload = async () => {
    window.location.href = `${apiUrl}/v1/meme-posts/${meme.id}/download`;
  };

  const handleLikeToggle = async () => {
    if (!meme) return;

    const newIsLiked = !meme.isLiked;
    const newLikeCount = newIsLiked ? meme.likeCount + 1 : meme.likeCount - 1;

    setMeme((prevMeme) => ({
      ...prevMeme,
      isLiked: newIsLiked,
      likeCount: newLikeCount,
    }));

    try {
      const response = await api.post(`/meme-posts/${id}/toggleLike`);
      const { isLiked } = response.data.data;

      setMeme((prevMeme) => ({
        ...prevMeme,
        isLiked,
      }));
    } catch (error) {
      console.error("Failed to toggle like:", error);

      setMeme((prevMeme) => ({
        ...prevMeme,
        isLiked: !newIsLiked,
        likeCount: newIsLiked ? prevMeme.likeCount - 1 : prevMeme.likeCount + 1,
      }));
    }
  };

  function shareOnKakao() {
    const imageUrl = `${meme.imageUrl}`;
    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: "Check out this meme!",
        description: "Funny meme to share.",
        imageUrl: imageUrl,
        link: {
          mobileWebUrl: imageUrl,
          webUrl: imageUrl,
        },
      },
    });
  }

  function shareOnTwitter() {
    const imageUrl = `${meme.imageUrl}`;
    const shareText = `Check out this meme!`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(imageUrl)}`;
    window.open(shareUrl, "_blank");
  }

  function copyLink() {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => toast.success("링크가 복사되었습니다!"))
      .catch((err) => console.error("Failed to copy link: ", err));
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="memedetail">
      <div className="memedetail-info">
        <div className="memedetail-left">
          <ResponsiveImage mediaInfo={meme.mediaInfo} />

          <div className="memedetail-left-info">
            <Link to={`/users/${meme.username}`} className="memedetail-link">
              <img src={`${meme.userProfileImageUrl}`} alt={meme.username} />
              <span>{meme.username}</span>
            </Link>
            <button onClick={handleLikeToggle}>
              {meme.isLiked ? (
                <GoHeartFill style={{ fontSize: "24px", color: "#e74c3c" }} />
              ) : (
                <GoHeart style={{ fontSize: "24px" }} />
              )}
              <span>{formatNumber(meme.likeCount)}</span>
            </button>
          </div>
        </div>

        <div className="memedetail-right">
          <div className="stats-container">
            <div className="stat-item">
              <GrFormView className="stat-icon" />
              <div className="stat-info">
                <span className="stat-label">조회수</span>
                <span className="stat-value">
                  {formatNumber(meme.viewCount)}
                </span>
              </div>
            </div>
            <div className="stat-item">
              <GoHeartFill className="stat-icon heart" />
              <div className="stat-info">
                <span className="stat-label">좋아요</span>
                <span className="stat-value">
                  {formatNumber(meme.likeCount)}
                </span>
              </div>
            </div>
            <div className="stat-item">
              <IoMdDownload className="stat-icon" />
              <div className="stat-info">
                <span className="stat-label">다운로드</span>
                <span className="stat-value">
                  {formatNumber(meme.downloadCount)}
                </span>
              </div>
            </div>
          </div>

          {/* 다운로드 버튼 */}
          <button className="download-btn" onClick={handleDownload}>
            <MdDownload />
            다운로드
          </button>

          {/* 공유 메뉴 */}
          <div className="share-menu">
            <button onClick={shareOnKakao} title="카카오톡 공유">
              <SiKakaotalk />
            </button>
            <button onClick={shareOnTwitter} title="트위터 공유">
              <FaSquareXTwitter />
            </button>
            <button title="페이스북 공유">
              <FaFacebookSquare />
            </button>
            <button onClick={copyLink} title="링크 복사">
              <FaLink />
            </button>
          </div>

          {/* 태그 */}
          <div className="memedetail-tags">
            {meme.tags.map((tag, index) => (
              <span key={index} className="memedetail-tag">
                #{tag}
              </span>
            ))}
          </div>

          <details className="technical-info">
            <summary>상세 정보</summary>
            <div className="tech-details">
              <div>
                해상도: {meme.width} × {meme.height}px
              </div>
              <div>파일 크기: {meme.size}</div>
            </div>
          </details>
        </div>
      </div>

      <div className="recommend-meme">
        <MemeSwiper memes={recommendedMemes} />
      </div>
    </div>
  );
}

export default MemeDetailPage;
