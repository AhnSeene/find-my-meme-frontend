import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../contexts/api";

const useInfiniteMemesQuery = (
  selectedSubTags = [],
  isProfile = false,
  username = ""
) => {
  // fetchMemes 데이터 가져오는 함수
  const fetchMemes = async ({ pageParam = 0 }) => {
    const tagsQuery =
      selectedSubTags.length > 0 ? `&tags=${selectedSubTags.join(",")}` : "";
    const url = isProfile
      ? `/meme-posts/users/${username}?page=${pageParam}&size=5${tagsQuery}`
      : `/meme-posts?page=${pageParam}&size=5${tagsQuery}`;

    const response = await api.get(url);
    const data = isProfile ? response.data.data.memePosts : response.data.data;

    return {
      content: data.content,
      nextPage: data.hasNext ? pageParam + 1 : undefined,
    };
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, error } =
    useInfiniteQuery({
      queryKey: ["memes", { selectedSubTags, isProfile, username }],
      queryFn: fetchMemes,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });
  const memes = data?.pages.flatMap((page) => page.content) || [];
  return {
    memes,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    error,
  };
};

export default useInfiniteMemesQuery;
