import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../contexts/api";
import useMemesFilterStore from "../store/useMemesFilterStore";

const useHomeMemesQuery = () => {
  const { selectedSubTags, mediaType } = useMemesFilterStore();

  const fetchMemes = async ({ pageParam = 0 }) => {
    const tagsQuery =
      selectedSubTags.length > 0 ? `&tagIds=${selectedSubTags.join(",")}` : "";
    const mediaTypeQuery = mediaType ? `&mediaType=${mediaType}` : "";
    const url = `/meme-posts?page=${pageParam}&size=10${mediaTypeQuery}${tagsQuery}`;

    const response = await api.get(url);
    const data = response.data.data;

    return {
      content: data.content,
      nextPage: data.hasNext ? pageParam + 1 : undefined,
    };
  };

  const result = useInfiniteQuery({
    queryKey: ["memes", { selectedSubTags, mediaType }],
    queryFn: fetchMemes,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return {
    memes: result.data?.pages.flatMap((page) => page.content) || [],
    ...result,
  };
};

export default useHomeMemesQuery;
