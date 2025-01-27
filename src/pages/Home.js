import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import TagSelector from "../components/TagSelector";
import MemeGrid from "../components/MemeGrid";
import useInfiniteMemesQuery from "../hooks/useInfiniteMemesQuery";
import "./home.css";

function Home() {
  const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
  const [selectedSubTags, setSelectedSubTags] = useState([]);

  // 기본값 설정
  const isProfile = false;
  const username = "";

  const { memes, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteMemesQuery(selectedSubTags);

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
    console.log("Infinite Memes Query Data:", memes);

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
      <TagSelector
        selectedSubTags={selectedSubTags}
        setSelectedSubTags={setSelectedSubTags}
      />
      <MemeGrid
        memes={memes}
        fileBaseUrl={fileBaseUrl}
        selectedSubTags={selectedSubTags}
        isProfile={isProfile}
        username={username}
      />

      {isLoading && <p>Loading...</p>}
      <div ref={observerRef} style={{ height: "1px" }} />
    </div>
  );
}

export default Home;
