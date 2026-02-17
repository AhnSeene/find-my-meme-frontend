import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../contexts/api";
import useAuthStore from "../store/useAuthStore";
import useMemesFilterStore from "../store/useMemesFilterStore";
import { toast } from "react-toastify";

const useToggleLike = ({ isProfile, username }) => {
  const { selectedSubTags, mediaType } = useMemesFilterStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ memeId, isLiked }) => {
      if (!isLoggedIn) {
        toast.error("로그인해야 사용할 수 있습니다.");
        throw new Error("로그인이 필요합니다.");
      }
      const response = await api.post(
        `/meme-posts/${memeId}/toggleLike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response;
    },
    onMutate: async ({ memeId, isLiked }) => {
      const queryKey = isProfile
        ? ["profileMemes", username]
        : ["memes", { selectedSubTags, mediaType }];

      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.map((meme) => {
              if (meme.id === memeId) {
                return {
                  ...meme,
                  isLiked: !isLiked,
                  likeCount: isLiked ? meme.likeCount - 1 : meme.likeCount + 1,
                };
              }
              return meme;
            }),
          })),
        };
      });

      return { previousData, queryKey };
    },
    onError: (error, { memeId, isLiked }, context) => {
      queryClient.setQueryData(context.queryKey, context.previousData);
    },
    onSettled: () => {},
  });
};

export default useToggleLike;
