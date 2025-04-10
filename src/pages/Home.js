import React, { useState, useEffect, useRef, useCallback } from "react";
import TagSelector from "../components/TagSelector";
import MemeGrid from "../components/MemeGrid";
import useInfiniteMemesQuery from "../hooks/useInfiniteMemesQuery";
import "./home.css";

function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSubTags, setSelectedSubTags] = useState([]);
  const [mediaType, setMediaType] = useState("");

  // 기본값 설정
  const isProfile = false;
  const username = "";

  const { memes, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteMemesQuery(selectedSubTags, isProfile, username, mediaType);

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

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <div className="home">
      <button
        className={`filter-button ${isFilterOpen ? "active" : ""}`}
        onClick={toggleFilter}
      >
        필터 <span className="arrow">▼</span>
      </button>
      {isFilterOpen && (
        <div className={`filter-pannel ${isFilterOpen ? "active" : ""}`}>
          <TagSelector
            selectedSubTags={selectedSubTags}
            setSelectedSubTags={setSelectedSubTags}
          />
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
      )}

      <MemeGrid
        memes={memes}
        selectedSubTags={selectedSubTags}
        isProfile={isProfile}
        username={username}
        mediaType={mediaType}
      />

      {isLoading && <p>Loading...</p>}
      <div ref={observerRef} style={{ height: "1px" }} />
    </div>
  );
}

export default Home;
