import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from 'swiper/modules';
import { Link } from "react-router-dom";
import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/grid';
import SwiperCore from "swiper";

SwiperCore.use([Navigation, Grid]);

const MemeSlider = ({ memes, title }) => {
    const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
    return (
        <div className="meme-slider">
            <h2>{title}</h2>
            <Swiper
                slidesPerView={5} // 한 줄에 5개의 슬라이드 보이기
                spaceBetween={10} // 슬라이드 사이의 간격
                navigation
                loop={false}
                grid={{
                    rows: 2, // 두 줄로 나누기
                    fill: 'row', // 슬라이드를 행 단위로 채우기
                }}
                slidesPerGroup={10} // 한 번에 이동할 슬라이드의 그룹 크기
                style={{ width: "80%", height: "600px" }} // 컨테이너 크기 조정
            >
                {memes.map((meme, index) => (
                    <SwiperSlide key={index} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Link  to={`/meme/${meme.id}`}>
                            <img src={`${fileBaseUrl}${meme.imageUrl}`} alt={`Meme ${index + 1}`} style={{ width: "90%", height: "90%", objectFit: "cover" }} />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default MemeSlider;
