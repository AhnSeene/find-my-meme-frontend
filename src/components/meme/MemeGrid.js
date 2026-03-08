import React from "react";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { GrFormView } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import useToggleLike from "../../hooks/useToggleLike";
import ResponsiveImage from "../common/ResponsiveImage";
import "./MemeGrid.css";

function MemeGrid({ memes, isProfile, username }) {
  const { mutate } = useToggleLike({
    isProfile,
    username,
  });

  const breakpointColumnsObj = {
    default: 4,
    1024: 4,
    768: 3,
    500: 2,
  };

  const handleLikeClick = (memeId, isLiked) => {
    mutate({ memeId, isLiked });
  };

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
                <ResponsiveImage mediaInfo={meme.mediaInfo} />
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
