import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { FaSearch } from "react-icons/fa";
import CommentList from "../../components/comment/CommentList";
import CommentForm from "../../components/comment/CommentForm";
import useAuthStore from "../../store/useAuthStore";
import api from "../../contexts/api";
import "./FindMemeDetailPage.css";

function FindMemeDetailPage() {
  const usernameFromStore = useAuthStore((state) => state.username);
  const { id } = useParams();
  const [isFind, setisFind] = useState("");
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/find-posts/${id}`);
        setPost(response.data);
        setCommentCount(response.data.data.commentCount);
        setisFind(response.data.data.status);
      } catch (error) {
        console.error("게시글 불러오기 오류:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await api.get(`/find-posts/${id}/comments`);
        setComments(response.data.data || []);
      } catch (error) {
        console.error("댓글 불러오기 오류 :", error);
      }
    };
    fetchPost();
    fetchComments();
  }, [id]);

  if (!post) return <p>불러올 게시글이 없습니다</p>;

  const handleDelete = async () => {
    try {
      await api.delete(`/find-posts/${id}`);
      setPost(null);
      navigate("/findmeme");
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/findmeme/edit/${id}`, { state: { post: post.data } });
  };

  const handleCommentAdded = (newComment, replyTo) => {
    const addReplyToComment = (comments, replyTo) => {
      return comments.map((comment) => {
        if (comment.id === replyTo) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newComment],
          };
        } else if (comment.replies) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies, replyTo),
          };
        }
        return comment;
      });
    };

    if (replyTo) {
      setComments((prevComments) => addReplyToComment(prevComments, replyTo));
    } else {
      setComments((prevComments) => [...prevComments, newComment]);
    }
    setReplyingTo(null);
    setCommentCount((prevCount) => prevCount + 1);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await api.delete(
        `/find-posts/${post.data.id}/comments/${commentId}`
      );
      const updatedComment = response.data.data;
      const updateDeletedComment = (comments) =>
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              htmlContent: updatedComment.htmlContent,
              deletedAt: updatedComment.deletedAt,
              selected: updatedComment.selected,
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateDeletedComment(comment.replies),
            };
          }
          return comment;
        });

      setComments((prevComments) => updateDeletedComment(prevComments));
      setCommentCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  const handleReply = (parentCommentId) => {
    setReplyingTo(parentCommentId);
    setShowCommentForm(true);
  };

  const handleInputClick = () => {
    setShowCommentForm(true);
  };

  const handleCancelComment = () => {
    setShowCommentForm(false);
    setReplyingTo(null);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className="findMemeDetail">
      <div className="findMemeDetail-title">
        {isFind === "FIND" ? (
          <img src="/question.svg" alt="찾아줘게시글" />
        ) : (
          <img src="/exclamation.svg" alt="찾았다게시글" />
        )}
        <div>{post.data.title}</div>
      </div>
      <div className="findMemeDetail-dates">
        <div>
          작성일자:{" "}
          {new Date(post.data.createdAt)
            .toISOString()
            .split("T")[0]
            .replace(/-/g, ".")}
        </div>
      </div>
      <div
        className="findMemeDetail-content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.data.htmlContent) }}
      />
      <div className="findMemeDetail-tags">
        {post.data.tags.map((tag) => (
          <span key={tag.id} className="tag-item">
            #{tag.name}
          </span>
        ))}
      </div>
      {usernameFromStore === post.data.username && (
        <div className="findMemeDetail-actions">
          <button className="findMemeDetail-btn" onClick={handleEdit}>
            수정
          </button>
          <button className="findMemeDetail-btn delete" onClick={handleDelete}>
            삭제
          </button>
        </div>
      )}

      {usernameFromStore ? (
        <>
          {!showCommentForm && (
            <input
              className="findMemeDetail-input"
              placeholder={`${usernameFromStore}님 댓글을 입력하세요`}
              onClick={handleInputClick}
              onFocus={handleInputClick}
            />
          )}
        </>
      ) : (
        <p>댓글을 작성하려면 로그인이 필요합니다.</p>
      )}

      {showCommentForm && (
        <CommentForm
          postId={post.data.id}
          onCommentAdded={handleCommentAdded}
          replyingTo={replyingTo}
          onCancel={handleCancelComment}
        />
      )}
      <div className="comments-section">
        <div>댓글({commentCount})</div>
        <CommentList
          postId={post.data.id}
          comments={comments}
          onDelete={handleDeleteComment}
          onReply={handleReply}
          replyingTo={replyingTo}
          onReplySubmit={handleCommentAdded}
          onCancelReply={handleCancelReply}
          userUsername={usernameFromStore}
          postOwnerUsername={post.data.username}
        />
      </div>
    </div>
  );
}

export default FindMemeDetailPage;
