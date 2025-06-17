import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../contexts/api";

const useProfileMemesQuery = (username) => {
  const fetchProfileMemes = async ({ pageParam = 0 }) => {
    const url = `/meme-posts/users/${username}?page=${pageParam}&size=10`;
    const response = await api.get(url);
    const data = response.data.data.memePosts;

    return {
      content: data.content,
      nextPage: data.hasNext ? pageParam + 1 : undefined,
    };
  };

  const result = useInfiniteQuery({
    queryKey: ["profileMemes", username],
    queryFn: fetchProfileMemes,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
  console.log("useInfiniteQuery result:", result);
  console.log("📄 pages:", result.data?.pages);
  console.log(
    "🧩 각 page의 content:",
    result.data?.pages?.map((p, i) => ({ page: i, content: p.content }))
  );
  return {
    memes: result.data?.pages.flatMap((page) => page.content) || [],
    ...result,
  };
};
export default useProfileMemesQuery;
