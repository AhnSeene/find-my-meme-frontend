import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { GrFormView } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
import useToggleLike from "../../hooks/useToggleLike";
import "swiper/css/navigation";
import "./memeSlider.css";

const MemeSlider = ({ memes }) => {
  const { mutate } = useToggleLike({
    selectedSubTags: [],
    mediaType: "memeSlider",
    isProfile: false,
    username: "",
  });
  const handleLikeClick = (memeId, isLiked) => {
    mutate({ memeId, isLiked });
    console.log("하트 눌림");
  };

  return (
    <div className="meme-slider-container">
      <Swiper
        modules={[Navigation]}
        navigation={true}
        slidesPerView={3}
        spaceBetween={5} // 슬라이드 사이의 간격
        slidesPerGroup={3}
        loop={false}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="meme-swiper"
      >
        {memes.map((meme, index) => (
          <SwiperSlide key={index} className="meme-slide">
            <Link to={`/meme/${meme.id}`}>
              <img
                src={`${meme.imageUrl}`}
                alt={`Meme ${index + 1}`}
                className="meme-image"
              />
              <div className="overlay">
                <div className="meme-info">
                  <GoHeartFill className="icon" /> {meme.likeCount}
                  <GrFormView className="icon" /> {meme.viewCount}
                  <IoMdDownload className="icon" /> {meme.downloadCount}
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MemeSlider;
