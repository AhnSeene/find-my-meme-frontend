import { useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import './findmemedetail.css';

function FindMemeDetail (){
    const {id} = useParams();
    const [post,setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [showCommentForm, setShowCommentForm] = useState(false); // CommentForm 표시 여부를 관리
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/find-posts/${id}`);
                setPost(response.data);
                setComments(response.data.comments);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        }
        fetchPost();
    },[id]);

    if (!post) return <p>불러올 게시글이 없습니다</p>

    // 게시글 삭제
    const handleDelete = () => {
        // 삭제 버튼 클릭 시 처리할 로직 추가
        console.log("삭제 버튼 클릭");
    };

    const handleEdit = () => {

        // 수정 페이지로 이동하면서 해당 게시글의 ID 전달
        navigate(`/findmeme/edit/${id}`, { state: { post: post.data } });
    };

    const handleCommentAdded = (newComment, replyTo) => {
        if (replyTo) {
          setComments(prevComments => {
            const addReply = (comments) => comments.map(comment => {
              if (comment.id === replyTo) {
                return { ...comment, replies: [...(comment.replies || []), newComment] };
              }
              if (comment.replies) {
                return { ...comment, replies: addReply(comment.replies) };
              }
              return comment;
            });
            return addReply(prevComments);
          });
        } else {
          setComments(prevComments => [...prevComments, newComment]);
        }
      }
    
      const handleCommentDeleted = (commentId) => {
        const deleteComment = (comments) => comments.filter(comment => {
          if (comment.id === commentId) return false;
          if (comment.replies) comment.replies = deleteComment(comment.replies);
          return true;
        });
        setComments(deleteComment(comments));
      };
    
      const handleReply = (parentCommentId) => {
        setReplyingTo(parentCommentId);
      };

      const handleInputClick = () => {
        setShowCommentForm(true);
      }

    return(
        <div className="findMemeDetail">
            <div className="findMemeDetail-title">
                <FaSearch />
                <div>{post.data.title}</div>
            </div>
            <div className="findMemeDetail-dates">
                <div>작성일자: {new Date(post.data.createdAt).toISOString().split('T')[0].replace(/-/g, '.')}</div>
            </div>
            <div className="findMemeDetail-content" dangerouslySetInnerHTML={{ __html: post.data.htmlContent }} />
            {post.data.owner && (
                <div className="findMemeDetail-actions">
                    <button className="findMemeDetail-btn" onClick={handleEdit}>수정</button>
                    <button className="findMemeDetail-btn delete" onClick={handleDelete}>삭제</button>
                </div>
            )}

            {/* showCommentForm이 false일 때만 input 창 표시 */}
            {!showCommentForm && (
                <input 
                    className="findMemeDetail-input"
                    placeholder="댓글을 작성하세요" 
                    onClick={handleInputClick} 
                    onFocus={handleInputClick} // 포커스 시에도 CommentForm을 표시
                />
            )}

            {/* showCommentForm이 true일 때만 CommentForm을 표시 */}
            {showCommentForm && (
                <CommentForm 
                    postId={id} 
                    onCommentAdded={handleCommentAdded} 
                    replyingTo={replyingTo} 
                />
            )}
            
            <CommentList 
                comments={comments} 
                onDelete={handleCommentDeleted} 
                onReply={handleReply} 
            />
        </div>
    )
}

export default FindMemeDetail;