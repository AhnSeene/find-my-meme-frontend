// MemeGrid.js
import React, { useEffect } from "react";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { GrFormView } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import useToggleLike from "../hooks/useToggleLike";
import { useAuth } from "../contexts/AuthContext";
import "./MemeGrid.css";

function MemeGrid({
  memes,
  fileBaseUrl,
  selectedSubTags = [],
  isProfile,
  username,
  mediaType,
}) {
  const { authState } = useAuth();
  const { mutate } = useToggleLike({
    selectedSubTags,
    isProfile,
    username,
    authState,
    mediaType,
  });

  console.log("Memes data:", memes);
  const breakpointColumnsObj = {
    default: 5,
    1024: 5,
    768: 4,
    500: 2,
  };
  const handleLikeClick = (memeId, isLiked) => {
    console.log(" handleLikeClick");
    // 서버 요청 및 캐시 업데이트
    mutate({ memeId, isLiked });
  };
  useEffect(() => {
    console.log("memegrid:", memes);
  });
  return (
    <div className="MemeGrid">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {memes.map((meme, index) => (
          <div key={meme.id} className="meme-item">
            <div className="meme-image-container">
              <Link to={`/meme/${meme.id}`}>
                <img
                  src={`${fileBaseUrl}${meme.imageUrl}`}
                  alt={`Meme ${index}`}
                />
                <div className="overlay">
                  <div className="meme-info">
                    <GoHeartFill style={{ fontSize: "20px" }} />{" "}
                    {meme.likeCount}
                    <GrFormView style={{ fontSize: "30px" }} /> {meme.viewCount}
                    <IoMdDownload style={{ fontSize: "24px" }} />{" "}
                    {meme.downloadCount}
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
              <button onClick={() => handleLikeClick(meme.id, meme.isLiked)}>
                {meme.isLiked ? (
                  <GoHeartFill style={{ fontSize: "30px", color: "red" }} />
                ) : (
                  <GoHeart style={{ fontSize: "30px" }} />
                )}
              </button>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
}

export default MemeGrid;
