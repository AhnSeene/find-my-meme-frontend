import { useEffect, useRef, useCallback } from "react";
import TagSelector from "../../components/TagSelector";
import MemeGrid from "../../components/MemeGrid";
import "./home.css";
import useHomeMemesQuery from "../../hooks/useHomeMemesQuery";
import useMemesFilterStore from "../../store/useMemesFilterStore";

function Home() {
  const { selectedSubTags, setSelectedSubTags, mediaType, setMediaType } =
    useMemesFilterStore();
  const { memes, fetchNextPage, hasNextPage, isLoading } = useHomeMemesQuery();

  const observerRef = useRef(null);
  console.log("selectedSubTags:", selectedSubTags);
  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isLoading) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isLoading]
  );
  useEffect(() => {
    console.log("memes:", memes);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null, //뷰포트 기준
      rootMargin: "100px", // 트리거를 뷰포트보다 약간 일찍 실행
      threshold: 0.1, //요소가 10%이상 보이면 트리거
    });
    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  return (
    <div className="home">
      <div className="filter">
        <TagSelector />
        <div className="mediaTypeSelect">
          <button
            type="button"
            onClick={() => setMediaType("")}
            className={mediaType == "" ? "active" : ""}
          >
            전체
          </button>
          <button
            type="button"
            onClick={() => setMediaType("ANIMATED")}
            className={mediaType == "ANIMATED" ? "active" : ""}
          >
            GIF
          </button>
          <button
            type="button"
            onClick={() => setMediaType("STATIC")}
            className={mediaType == "STATIC" ? "active" : ""}
          >
            사진
          </button>
        </div>
      </div>

      <MemeGrid memes={memes} isProfile={false} />

      {isLoading && <p>Loading...</p>}
      <div ref={observerRef} style={{ height: "1px" }} />
    </div>
  );
}

export default Home;
