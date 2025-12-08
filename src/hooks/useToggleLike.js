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
        throw new Error("로그인이 필요합니다."); // 요청 중단
      }
      try {
        const response = await api.post(
          `/meme-posts/${memeId}/toggleLike`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Response:", response); // 응답 확인
        return response;
      } catch (error) {
        console.error("API error:", error); // 에러 확인
        throw error;
      }
    },
    onMutate: async ({ memeId, isLiked }) => {
      const queryKey = isProfile
        ? ["profileMemes", username]
        : ["memes", { selectedSubTags, mediaType }];

      // 이전 데이터 가져오기
      const previousData = queryClient.getQueryData(queryKey);
      console.log(previousData);
      queryClient.setQueryData(queryKey, (oldData) => {
        console.log("oldData.pages:", oldData.pages);
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.map((meme) => {
              console.log("meme.id :", meme.id, "memeId :", memeId);
              if (meme.id === memeId) {
                console.log("좋아요 찍혀야됨..");
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
