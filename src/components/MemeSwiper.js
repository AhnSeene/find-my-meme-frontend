import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules'; //이거 주의
import 'swiper/css/pagination'; 
import 'swiper/css/navigation';
import 'swiper/css';
function MemeSwiper({ memes }) {
    const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
    return (
        <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={50}
            slidesPerView={3}
            pagination={{
                type: 'progressbar', // 페이지네이션 타입을 progressbar로 설정
            }}
            navigation
        >
            {memes.map((meme, index) => (
                <SwiperSlide key={index}>
                    <img src={`${fileBaseUrl}${meme.imageUrl}`} alt={`Meme ${index}`} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default MemeSwiper;
