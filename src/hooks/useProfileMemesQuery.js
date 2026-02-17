import { useInfiniteQuery } from "@tanstack/react-query";
import useAuthStore from "../store/useAuthStore";
import api from "../contexts/api";

const useProfileMemesQuery = (username) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const currentUsername = useAuthStore((state) => state.username);
  const isOwnProfile = currentUsername === username;

  const fetchProfileMemes = async ({ pageParam = 0 }) => {
    const url = isOwnProfile
      ? `/meme-posts/me?page=${pageParam}&size=10`
      : `/meme-posts/users/${username}?page=${pageParam}&size=10`;
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
    enabled: !!username && (isOwnProfile ? isLoggedIn : true),
  });

  return {
    memes: result.data?.pages.flatMap((page) => page.content) || [],
    ...result,
  };
};
export default useProfileMemesQuery;
