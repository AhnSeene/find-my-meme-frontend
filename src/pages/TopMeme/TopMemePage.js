import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { GrFormView } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import useToggleLike from "../../hooks/useToggleLike";
import api from "../../contexts/api";
import "./TopMemePage.css";

function TopMemePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [memes, setMemes] = useState({
    topView: [],
    topLike: [],
    topWeek: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = useToggleLike({
    selectedSubTags: [],
    mediaType: "topMeme",
    isProfile: false,
    username: "",
  });

  useEffect(() => {
    const fetchMemes = async () => {
      setIsLoading(true);
      try {
        const [viewRes, likeRes, weekRes] = await Promise.all([
          api.get("/meme-posts/ranked?page=0&size=20&period=ALL&sort=VIEW"),
          api.get("/meme-posts/ranked?page=0&size=20&period=ALL&sort=LIKE"),
          api.get("/meme-posts/ranked?page=0&size=20&period=WEEK&sort=LIKE"),
        ]);

        setMemes({
          topView: viewRes.data.data.content,
          topLike: likeRes.data.data.content,
          topWeek: weekRes.data.data.content,
        });
      } catch (error) {
        console.error("TopMeme 데이터 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemes();
  }, []);

  const handleLikeClick = (memeId, isLiked) => {
    mutate({ memeId, isLiked });
  };

  const categories = [
    { label: "조회수 높은 순", data: memes.topView },
    { label: "좋아요 높은 순", data: memes.topLike },
    { label: "이번주 인기", data: memes.topWeek },
  ];

  const activeCategory = categories[activeIndex];

  return (
    <div className="topmeme">
      {/* 상단 탭 형태로 카테고리 */}
      <div className="topmeme-tabs">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`tab-button ${activeIndex === index ? "active" : ""}`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* 그리드 레이아웃 */}
      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>로딩중...</p>
        </div>
      ) : (
        <div className="meme-grid">
          {activeCategory.data.map((meme, index) => (
            <div key={meme.id} className="meme-card">
              {/* 순위 배지 (상위 10개만) */}
              {index < 10 && (
                <div className={`rank-badge ${index < 3 ? "top3" : ""}`}>
                  {index + 1}
                </div>
              )}

              <Link to={`/meme/${meme.id}`}>
                <img
                  src={meme.mediaInfo.thumbnails[0].url}
                  alt={`Meme ${index + 1}`}
                  className="meme-image"
                />
                <div className="overlay">
                  <div className="meme-info">
                    <span>
                      <GoHeartFill className="icon" /> {meme.likeCount}
                    </span>
                    <span>
                      <GrFormView className="icon" /> {meme.viewCount}
                    </span>
                    <span>
                      <IoMdDownload className="icon" /> {meme.downloadCount}
                    </span>
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

              <button
                className="like-button"
                onClick={(e) => {
                  e.preventDefault();
                  handleLikeClick(meme.id, meme.isLiked);
                }}
              >
                {meme.isLiked ? (
                  <GoHeartFill style={{ fontSize: "26px", color: "#e74c3c" }} />
                ) : (
                  <GoHeart style={{ fontSize: "26px", color: "#6c757d" }} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopMemePage;
