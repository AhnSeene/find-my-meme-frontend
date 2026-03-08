import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import CommentForm from "./CommentForm";
import api from "../../contexts/api";
import "./commentlist.css";

function CommentList({
  comments,
  onDelete,
  onReply,
  replyingTo,
  onReplySubmit: onReplySubmitProp,
  onCancelReply,
  postId,
  userUsername,
  postOwnerUsername,
}) {
  const [commentList, setCommentList] = useState(comments || []);

  useEffect(() => {
    setCommentList(comments || []);
  }, [comments]);

  const updateReplies = (replies, newReply, parentCommentId) => {
    return replies.map((reply) => {
      if (reply.id === parentCommentId) {
        return {
          ...reply,
          replies: [...reply.replies, newReply],
        };
      } else if (reply.replies && reply.replies.length > 0) {
        return {
          ...reply,
          replies: updateReplies(reply.replies, newReply, parentCommentId),
        };
      } else {
        return reply;
      }
    });
  };

  const handleSelect = async (commentId) => {
    try {
      await api.post(`/find-posts/${postId}/comments/${commentId}/select`);
      setCommentList((prevComments) =>
        prevComments.map((comment) => updateSelected(comment, commentId))
      );
    } catch (error) {
      console.error("Failed to select comment:", error);
    }
  };

  const updateSelected = (comment, selectedId) => {
    if (comment.id === selectedId) {
      return { ...comment, selected: true };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: comment.replies.map((reply) =>
          updateSelected(reply, selectedId)
        ),
      };
    }
    return comment;
  };

  const handleReply = (commentId) => {
    const topParentCommentId = findTopParentCommentId(commentId, commentList);
    onReply(topParentCommentId || commentId);
  };

  const findTopParentCommentId = (commentId, comments) => {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment.parentCommentId || comment.id;
      }
      if (comment.replies && comment.replies.length > 0) {
        const topParentId = findTopParentCommentId(commentId, comment.replies);
        if (topParentId) {
          return topParentId;
        }
      }
    }
    return null;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.toISOString().split("T")[0].replace(/-/g, ".")} ${
      date.toTimeString().split(" ")[0]
    }`;
  };

  const renderCommentsAndReplies = (comments) => {
    return comments.map((comment) => (
      <div
        key={comment.id}
        className={`comment-container ${comment.selected ? "selected" : ""}`}
      >
        <div className={`comment ${comment.selected ? "selected" : ""}`}>
          <div className="comment-username">{comment.username}</div>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.htmlContent) }} />
          {comment.deletedAt && (
            <div className="deleted-info">
              삭제된 시간 : {formatDateTime(comment.deletedAt)}
            </div>
          )}
          {comment.username === userUsername && !comment.deletedAt && (
            <button onClick={() => onDelete(comment.id)}>삭제</button>
          )}
          {postOwnerUsername === userUsername &&
            !comment.selected &&
            !comment.deletedAt && (
              <button onClick={() => handleSelect(comment.id)}>채택</button>
            )}
          <button onClick={() => handleReply(comment.id)}>답글</button>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="reply-list">
            {comment.replies
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((reply) => (
                <div
                  key={reply.id}
                  className={`reply ${reply.selected ? "selected" : ""}`}
                >
                  <div className="reply-to">
                    @{comment.username}{" "}
                    <span className="username">{reply.username}</span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.htmlContent) }}
                  />
                  {reply.deletedAt && (
                    <div className="deleted-info">
                      삭제된 시간: {formatDateTime(reply.deletedAt)}
                    </div>
                  )}
                  {reply.username === userUsername && !reply.deletedAt && (
                    <button onClick={() => onDelete(reply.id)}>삭제</button>
                  )}
                  {postOwnerUsername === userUsername &&
                    !reply.selected &&
                    !reply.deletedAt && (
                      <button onClick={() => handleSelect(reply.id)}>
                        채택
                      </button>
                    )}
                  <button onClick={() => handleReply(reply.id)}>답글</button>

                  {reply.replies && reply.replies.length > 0 && (
                    <div className="reply-list">
                      {renderCommentsAndReplies(reply.replies)}{" "}
                    </div>
                  )}

                  {replyingTo === reply.id && (
                    <CommentForm
                      postId={postId}
                      onCommentAdded={onReplySubmitProp}
                      replyingTo={reply.id}
                      onCancel={onCancelReply}
                    />
                  )}
                </div>
              ))}
          </div>
        )}

        {replyingTo === comment.id && (
          <CommentForm
            postId={postId}
            onCommentAdded={onReplySubmitProp}
            replyingTo={comment.id}
            onCancel={onCancelReply}
          />
        )}
      </div>
    ));
  };

  return (
    <div className="comments-section">
      {commentList.length > 0 ? (
        renderCommentsAndReplies(commentList)
      ) : (
        <p>댓글이 없습니다.</p>
      )}
    </div>
  );
}

export default CommentList;
