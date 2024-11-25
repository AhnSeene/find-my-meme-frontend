import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import TagSelector from "../components/TagSelector";
import "./home.css";
import MemeGrid from "../components/MemeGrid";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useToggleLike from "../hooks/useToggleLike";

function Home() {
  const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
  const { authState } = useAuth();
  const [selectedSubTags, setSelectedSubTags] = useState([]);

  const { memes, setMemes, loading, hasNext, setPage } =
    useInfiniteScroll(selectedSubTags);
  const toggleLike = useToggleLike(memes, setMemes, authState);

  useEffect(() => {
    // 태그가 변경될 때 메모리를 초기화하고 페이지를 0으로 설정
    setMemes([]); // 메모리 목록 초기화
    setPage(0); // 페이지 초기화
  }, [selectedSubTags, setMemes, setPage]);

  return (
    <div className="home">
      <TagSelector
        selectedSubTags={selectedSubTags}
        setSelectedSubTags={setSelectedSubTags}
      />
      <MemeGrid
        memes={memes}
        toggleLike={toggleLike}
        fileBaseUrl={fileBaseUrl}
      />

      {loading && <p>Loading...</p>}
    </div>
  );
}

export default Home;
