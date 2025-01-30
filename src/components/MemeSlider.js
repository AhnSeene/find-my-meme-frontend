import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css/navigation";
import "swiper/css";
import "./memeSlider.css";

const MemeSlider = ({ memes, title }) => {
  const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
  return (
    <div className="meme-slider-container">
      <h2>{title}</h2>
      <Swiper
        modules={[Navigation]}
        navigation={true}
        slidesPerView={5} // 한 줄에 5개의 슬라이드 보이기
        spaceBetween={20} // 슬라이드 사이의 간격
        slidesPerGroup={5}
        loop={false}
        breakpoints={{
          320: {
            slidesPerView: 2,
            slidesPerGroup: 2, // 모바일에서는 2개씩 이동
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 3,
            slidesPerGroup: 3, // 태블릿에서는 3개씩 이동
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 4,
            slidesPerGroup: 4, // 작은 데스크톱에서는 4개씩 이동
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 5,
            slidesPerGroup: 5, // 큰 화면에서는 5개씩 이동
            spaceBetween: 20,
          },
        }}
        className="meme-swiper"
      >
        {memes.map((meme, index) => (
          <SwiperSlide key={index} className="meme-slide">
            <Link to={`/meme/${meme.id}`}>
              <img
                src={`${fileBaseUrl}${meme.imageUrl}`}
                alt={`Meme ${index + 1}`}
                className="meme-image"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MemeSlider;
