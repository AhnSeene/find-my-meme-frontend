import { useEffect, useState } from "react";
import axios from "axios";
import './commentlist.css';

function CommentList({ comments, onDelete, onReply }) {
  // 초기 상태를 빈 배열로 설정
  const [commentList, setCommentList] = useState(comments || []);

  useEffect(() => {
    setCommentList(comments || []);
  }, [comments]);

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/comments/${commentId}`);
      onDelete(commentId);  // 상위 컴포넌트에 삭제 요청
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleReply = (parentCommentId) => {
    onReply(parentCommentId);
  };

    // 모든 댓글과 대댓글의 수를 계산하는 함수
    const countAllComments = (comments) => {
        let total = comments.length;  // 기본 댓글 수
        comments.forEach(comment => {
            if (comment.replies && comment.replies.length > 0) {
            total += countAllComments(comment.replies);  // 대댓글 수 추가
            }
        });
        return total;
        };

  const renderComments = (comments) => {
    return comments.map(comment => (
      <div key={comment.id} className="comment">
        <p><strong>{comment.author}</strong> - {new Date(comment.createdAt).toLocaleString()}</p>
        <div dangerouslySetInnerHTML={{ __html: comment.content }} />
        <button onClick={() => handleDelete(comment.id)}>삭제</button>
        <button onClick={() => handleReply(comment.id)}>답글</button>
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {renderComments(comment.replies)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="comments-section">
      <div className="commentsCount">댓글 ({countAllComments(commentList)})</div>
      {commentList.length > 0 ? renderComments(commentList) : <p>댓글이 없습니다.</p>}
    </div>
  );
}

export default CommentList;
