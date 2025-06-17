import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules'; //이거 주의
import { Link } from 'react-router-dom';
import 'swiper/css/pagination'; 
import 'swiper/css/navigation';
import 'swiper/css';
import './MemeSwiper.css'
function MemeSwiper({ memes }) {
    const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
    return (
        <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={10}
            slidesPerView={3}
            pagination={{
                type: 'progressbar', // 페이지네이션 타입을 progressbar로 설정
            }}
            navigation
            breakpoints={{
                320: {  // 화면 너비가 320px 이하일 때
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                768: {  // 화면 너비가 768px 이상일 때
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {  // 화면 너비가 1024px 이상일 때
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            }}
        >
            {memes.map((meme, index) => (
                <SwiperSlide key={index}>
                    <Link  to={`/meme/${meme.id}`}>
                        <img src={`${fileBaseUrl}${meme.imageUrl}`} alt={`Meme ${index}`} />
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default MemeSwiper;
