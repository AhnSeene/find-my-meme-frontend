// src/hooks/useToggleLike.js
import api from "../contexts/api";

const useToggleLike = (memes, setMemes, authState) => {
  const toggleLike = async (event, memeId) => {
    event.stopPropagation();
    const updatedMemes = memes.map((meme) => {
      if (meme.id === memeId) {
        const isLiked = !meme.isLiked;
        const likeCount = isLiked ? meme.likeCount + 1 : meme.likeCount - 1;
        return { ...meme, isLiked, likeCount };
      }
      return meme;
    });
    setMemes(updatedMemes);

    try {
      await api.post(
        `/meme-posts/${memeId}/toggleLike`,
        {},
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return toggleLike;
};

export default useToggleLike;
