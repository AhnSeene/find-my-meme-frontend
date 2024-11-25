// MemeGrid.js
import React from "react";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { GrFormView } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import "./MemeGrid.css";

function MemeGrid({ memes = [], toggleLike, fileBaseUrl }) {
  const breakpointColumnsObj = {
    default: 3,
    1024: 3,
    768: 2,
    500: 1,
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
              <button onClick={(e) => toggleLike(e, meme.id)}>
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
