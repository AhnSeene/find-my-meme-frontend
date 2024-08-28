import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import { useAuth } from "../contexts/AuthContext";
import api from "../contexts/api";
import './findmemedetail.css';

function FindMemeDetail() {
    const { authState } = useAuth();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentCount,setCommentCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/find-posts/${id}`);
                setPost(response.data);
                setCommentCount(response.data.data.commentCount);
            } catch (error) {
                console.error('게시글 불러오기 오류:', error);
            }
        }

        const fetchComments = async () => {
            try {
                const response = await api.get(`/find-posts/${id}/comments`);
                setComments(response.data.data || []);
            } catch (error) {
                console.error("댓글 불러오기 오류 :",error);
            }
        }
        fetchPost();
        fetchComments();
    }, [id]);

    if (!post) return <p>불러올 게시글이 없습니다</p>

    const handleDelete = async () => {
        try {
            await api.delete(`/find-posts/${id}`);
            setPost(null);  // 게시글 상태를 null로 설정하여 화면에서 제거
            navigate('/findmeme'); 
        } catch (error) {
            console.error("게시글 삭제 오류:", error);
        }
    };

    const handleEdit = () => {
        navigate(`/findmeme/edit/${id}`, { state: { post: post.data } });
    };

    const handleCommentAdded = (newComment, replyTo) => {
        const addReplyToComment = (comments, replyTo) => {
            return comments.map(comment => {
                if (comment.id === replyTo) {
                    return {
                        ...comment,
                        replies: [...(comment.replies || []), newComment]
                    };
                } else if (comment.replies) {
                    return {
                        ...comment,
                        replies: addReplyToComment(comment.replies, replyTo)
                    };
                }
                return comment;
            });
        };

        if (replyTo) {
            setComments(prevComments => addReplyToComment(prevComments, replyTo));
        } else {
            setComments(prevComments => [...prevComments, newComment]);
        }
        setReplyingTo(null);
        setCommentCount(prevCount => prevCount + 1); // 댓글 수 증가
    };

    const handleCommentDeleted = (commentId) => {
        const deleteComment = (comments) => comments.filter(comment => {
            if (comment.id === commentId) return false;
            if (comment.replies) comment.replies = deleteComment(comment.replies);
            return true;
        });
        setComments(deleteComment(comments));
        setCommentCount(prevCount => prevCount - 1); 
    };

    const handleReply = (parentCommentId) => {
        setReplyingTo(parentCommentId);
        setShowCommentForm(true);
    };

    const handleInputClick = () => {
        setShowCommentForm(true);
    }

      // 댓글 작성 창 닫기
    const handleCancelComment = () => {
        setShowCommentForm(false);
        setReplyingTo(null);
    };


    return (
        <div className="findMemeDetail">
            <div className="findMemeDetail-title">
                <FaSearch />
                <div>{post.data.title}</div>
            </div>
            <div className="findMemeDetail-dates">
                <div>작성일자: {new Date(post.data.createdAt).toISOString().split('T')[0].replace(/-/g, '.')}</div>
            </div>
            <div className="findMemeDetail-content" dangerouslySetInnerHTML={{ __html: post.data.htmlContent }} />
            <div className="findMemeDetail-tags">
                {post.data.tags.map(tag=>(
                    <span key={tag.id} className="tag-item">
                        #{tag.name}
                    </span>
                ))}
            </div>
            {authState.username === post.data.username && (
                <div className="findMemeDetail-actions">
                    <button className="findMemeDetail-btn" onClick={handleEdit}>수정</button>
                    <button className="findMemeDetail-btn delete" onClick={handleDelete}>삭제</button>
                </div>
            )}

            {authState.username? (
                <>
                    {!showCommentForm && (
                        <input
                            className="findMemeDetail-input"
                            placeholder={`${authState.username}님 댓글을 입력하세요`}
                            onClick={handleInputClick}
                            onFocus={handleInputClick}
                        />
                    )}
                </>
            ):(
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
                    onDelete={handleCommentDeleted}
                    onReply={handleReply}
                    replyingTo={replyingTo}
                    onReplySubmit={handleCommentAdded}
                    userUsername={authState.username} // 로그인된 사용자 이름 전달
                    postOwnerUsername={post.data.username}
                />
            </div>
        </div>
    )
}

export default FindMemeDetail;
