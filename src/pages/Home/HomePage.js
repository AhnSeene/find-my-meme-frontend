import { useRef, useCallback, useEffect } from "react";
import MemeGrid from "../../components/meme/MemeGrid";
import "./HomePage.css";
import useHomeMemesQuery from "../../hooks/useHomeMemesQuery";
import FilterBar from "../../components/filter/FilterBar";

function HomePage() {
  const { memes, fetchNextPage, hasNextPage, isLoading } = useHomeMemesQuery();

  const observerRef = useRef(null);
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
      <FilterBar />

      <MemeGrid memes={memes} isProfile={false} />

      {isLoading && <p>Loading...</p>}
      <div ref={observerRef} style={{ height: "1px" }} />
    </div>
  );
}

export default HomePage;
