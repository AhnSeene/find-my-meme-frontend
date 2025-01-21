// src/hooks/useInfiniteScrollMemes.js
import { useEffect, useState } from "react";
import api from "../contexts/api";

const useInfiniteScroll = (
  selectedSubTags=[],
  isProfile = false,
  username = ""
) => {
  const [memes, setMemes] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    // memes가 업데이트될 때마다 콘솔에 출력
    console.log("Fetched memes:", memes);
  }, [memes]);

  useEffect(() => {
    setMemes([]); // username이 변경될 때 memes 초기화
    setPage(0); // 페이지도 초기화
    setHasNext(true); // hasNext 초기화
    if (username) {
      loadMemes(0); // 바로 데이터를 로드
      console.log("데이터 불러오는데 ㅋ");
    }
  }, [username]);

  useEffect(() => {
    loadMemes(page); // page가 변경될 때마다 loadMemes 호출

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
          document.documentElement.offsetHeight &&
        hasNext
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, selectedSubTags, username]);

  const loadMemes = async () => {
    if (loading || !hasNext) return;
    setLoading(true);

    try {
      const tagsQuery =
        selectedSubTags.length > 0 ? `&tags=${selectedSubTags.join(",")}` : "";

      // API 요청 URL 결정
      const url = isProfile
        ? `/meme-posts/users/${username}?page=${page}&size=5${tagsQuery}`
        : `/meme-posts?page=${page}&size=5${tagsQuery}`;

      console.log(url);
      const response = await api.get(url);
      // 응답 구조에 따라 newMemes 설정
      const newMemes = isProfile
        ? response.data.data.memePosts.content // 사용자 프로필에서 가져오기
        : response.data.data.content; // 태그에 따른 가져오기
      setMemes((prevMemes) => [...prevMemes, ...newMemes]);
      setHasNext(response.data.data.hasNext);
    } catch (error) {
      console.error("Failed to load memes:", error);
    } finally {
      setLoading(false);
    }
  };

  return { memes, setMemes, loading, hasNext, setPage };
};

export default useInfiniteScroll;
