import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../contexts/api";
const useToggleLike = ({
  selectedSubTags = [],
  isProfile = false,
  username = "",
  authState,
  mediaType = "",
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memeId, isLiked }) => {
      return api.post(
        `/meme-posts/${memeId}/toggleLike`,
        {},
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );
    },
    onMutate: async ({ memeId, isLiked }) => {
      const queryKey = [
        "memes",
        { selectedSubTags, isProfile, username, mediaType },
      ];

      // 이전 데이터 가져오기
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
                  isLiked: !isLiked, // 반전된 isLiked 상태
                  likeCount: isLiked ? meme.likeCount - 1 : meme.likeCount + 1, // likeCount 변경
                };
              }
              return meme;
            }),
          })),
        };
      });

      // 이전 데이터 저장 (onError에서 롤백할 때 사용)
      return { previousData, queryKey };
    },
    onError: (error, { memeId, isLiked }, context) => {
      // 요청 실패 시 롤백
      queryClient.setQueryData(context.queryKey, context.previousData);
    },
    onSettled: (_, __, { memeId, isLiked }, context) => {},
  });
};

export default useToggleLike;
