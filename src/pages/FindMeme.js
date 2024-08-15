import { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './findmeme.css';
import { CgSearch } from "react-icons/cg";
import { CgSearchFound } from "react-icons/cg";

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
};

function FindMeme(){
    const navigate = useNavigate();
    const [findPost,setFindPost] = useState([]);
    const [foundPost,setFoundPost] = useState([]);
    const [isFindActive,setIsFindActive] = useState(true);
    const [loading,setLoading]=useState(false);
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 상태

    // 공통 데이터 로딩 함수
    const fetchData = async (url, setData) => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            setData(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(`http://localhost:8080/api/v1/find-posts?page=${currentPage}&size=3`, setFindPost);
    }, [currentPage]);

    const handleFind = () => {
        fetchData('/api/find', setFindPost);
        // setFindPost(mockFindPost);
        setIsFindActive(true);
    }

    const handleFound = () => {
        fetchData('/api/found', setFoundPost);
        // setFoundPost(mockFoundPost);
        setIsFindActive(false);
    }

    const handlePost = () => {
        navigate('/findmemepost',{replace:true})
    }

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    return(
        <div className="findmeme">
            <div className="findmeme-btn">
                <button onClick={handleFind}><CgSearch size={32}  /> 찾아줘</button>
                <button onClick={handleFound}> <CgSearchFound size={32} /> 찾았다</button>
            </div>
            <button className="findmeme-post-btn" onClick={handlePost}>글 등록</button>
            {loading && <p>Loading...</p>}
            {isFindActive ? (
                <div className="findmeme-posts">
                    {findPost.length > 0 ? (
                        findPost.map((post, index) => (
                            <div key={index} className="post-summary">
                                <Link to={`/findmeme/${post.id}`}>
                                    <div className="findmeme-posts-title">{post.title}</div>
                                    <div className="findmeme-posts-content">{post.content}</div>
                                    <div className="findmeme-posts-other">
                                        <div>{post.username}</div>
                                        <div>{formatDate(post.createdAt)}</div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>찾아줘 게시물 없음</p>
                    )}
                </div>
            ) : (
                <div className="findmeme-posts">
                    {foundPost.length > 0 ? (
                        foundPost.map((post, index) => (
                            <div key={index} className="post-summary">
                                <Link to={`/findmeme/${post.id}`}>
                                    <div className="findmeme-posts-title">{post.title}</div>
                                    <div className="findmeme-posts-content">{post.content}</div>
                                    <div className="findmeme-posts-other">
                                        <div>{post.username}</div>
                                        <div>{formatDate(post.createdAt)}</div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>찾았다 게시물 없음</p>
                    )}
                </div>
            )}
            {/* 페이지네이션 버튼 추가 */}
            {totalPages > 1 && !loading && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index)}
                            className={index === currentPage ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FindMeme;