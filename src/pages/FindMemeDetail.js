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

    //comments 업데이트 될때 출력 확인하려고
    useEffect(() => {
        console.log("Updated comments:", comments);
    }, [comments]);

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

    const handleDeleteComment = async (commentId) => {
        try {
            // 서버에 댓글 삭제 요청
            const response = await api.delete(`/find-posts/${post.data.id}/comments/${commentId}`);
            const updatedComment = response.data.data;
            // 로컬 상태에서 해당 댓글을 '삭제된 댓글입니다.'로 업데이트
            const updateDeletedComment = (comments) => comments.map(comment => {
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
            
            // 상태 업데이트
            setComments(prevComments => updateDeletedComment(prevComments));
            setCommentCount(prevCount => prevCount - 1); // 댓글 수 감소
    
        } catch (error) {
            console.error('댓글 삭제 오류:', error);
        }
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

        // 답글 창 닫기 핸들러 추가
    const handleCancelReply = () => {
        setReplyingTo(null);  // 답글 창을 닫기 위해 replyingTo를 null로 설정
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
                    onDelete={handleDeleteComment}
                    onReply={handleReply}
                    replyingTo={replyingTo}
                    onReplySubmit={handleCommentAdded}
                    onCancelReply={handleCancelReply}
                    userUsername={authState.username} // 로그인된 사용자 이름 전달
                    postOwnerUsername={post.data.username}
                />
            </div>
        </div>
    )
}

export default FindMemeDetail;
