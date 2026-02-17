import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "./MemeSwiper.css";

function MemeSwiper({ memes }) {
  if (!memes || memes.length === 0) {
    return (
      <div className="meme-swiper-empty">
        <p>추천 밈이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="meme-swiper-wrapper">
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={3}
        navigation
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 2.2,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
      >
        {memes.map((meme, index) => (
          <SwiperSlide key={meme.id || index}>
            <Link to={`/meme/${meme.id}`} className="meme-swiper-card">
              <img src={meme.imageUrl} alt={`Meme ${index}`} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default MemeSwiper;
