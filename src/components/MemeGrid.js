import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { GrFormView } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import useToggleLike from "../hooks/useToggleLike";
import "./MemeGrid.css";

function MemeGrid({ memes, selectedSubTags, mediaType, isProfile, username }) {
  const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
  const { mutate } = useToggleLike({
    selectedSubTags,
    mediaType,
    isProfile,
    username,
  });

  const [useMp4Map, setUseMp4Map] = useState({}); // 각 밈의 MP4 사용 여부 관리
  useEffect(() => {
    console.log("MP4 사용 여부 업데이트:", useMp4Map);
  }, [useMp4Map]);
  const handleVideoLoad = (memeId) => {
    setUseMp4Map((prev) => ({ ...prev, [memeId]: true }));
  };

  const handleVideoError = (memeId) => {
    setUseMp4Map((prev) => ({ ...prev, [memeId]: false }));
  };

  const getMediaElement = (meme, width) => {
    const { imageUrl, id } = meme;

    const mp4Url = imageUrl
      .replace("images/", "resized/")
      .replace(".gif", `_${width}w.mp4`);
    console.log("mp4" + " " + mp4Url);

    const resizedUrl = imageUrl
      .replace("images/", "resized/")
      .replace(/\.(jpg|jpeg|png)$/, `_${width}w.$1`);
    console.log("images " + resizedUrl);

    const gifUrl = imageUrl.replace("resized/", "images/");

    if (useMp4Map[id] === true) {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => handleVideoLoad(id)}
          onError={() => handleVideoError(id)}
        >
          <source src={`${fileBaseUrl}${mp4Url}`} type="video/mp4" />
        </video>
      );
    }

    return <img src={`${fileBaseUrl}${gifUrl}`} alt="Meme" />;
  };

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
                {getMediaElement(meme, 288)}
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
