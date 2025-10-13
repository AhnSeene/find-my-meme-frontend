import { useState, useEffect } from "react";
import MemeSlider from "../../components/meme/MemeSlider";
import api from "../../contexts/api";
import "./TopMemePage.css";

function TopMemePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [memes, setMemes] = useState({
    topView: [],
    topLike: [],
    topWeek: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMemes = async () => {
      setIsLoading(true);
      try {
        const [viewRes, likeRes, weekRes] = await Promise.all([
          api.get("/meme-posts/ranked?page=0&size=20&period=ALL&sort=VIEW"),
          api.get("/meme-posts/ranked?page=0&size=20&period=ALL&sort=LIKE"),
          api.get("/meme-posts/ranked?page=0&size=20&period=WEEK&sort=LIKE"),
        ]);

        setMemes({
          topView: viewRes.data.data.content,
          topLike: likeRes.data.data.content,
          topWeek: weekRes.data.data.content,
        });
      } catch (error) {
        console.error("TopMeme 데이터 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemes();
  }, []);

  const categories = [
    { label: "조회수 높은 순", data: memes.topView },
    { label: "좋아요 높은 순", data: memes.topLike },
    { label: "이번주 인기", data: memes.topWeek },
  ];

  const activeCategory = categories[activeIndex];

  return (
    <div className="topmeme">
      <div className="topmeme-categories">
        <ul>
          {categories.map((category, index) => (
            <li
              key={index}
              onClick={() => setActiveIndex(index)}
              className={activeIndex === index ? "active" : ""}
            >
              {category.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="slider-container">
        {isLoading ? (
          <div className="loading">로딩중...</div>
        ) : (
          <MemeSlider memes={activeCategory.data} />
        )}
      </div>
    </div>
  );
}

export default TopMemePage;
