import { useState, useEffect } from "react";
import api from "../contexts/api";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./findmeme.css";
import { CgSearch } from "react-icons/cg";
import { CgSearchFound } from "react-icons/cg";

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

function FindMeme() {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [findPost, setFindPost] = useState([]);
  const [foundPost, setFoundPost] = useState([]);
  const [isFindActive, setIsFindActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const [findPage, setFindPage] = useState(0); // "찾아줘" 페이지네이션 상태
  const [foundPage, setFoundPage] = useState(0); // "찾았다" 페이지네이션 상태
  const [findTotalPages, setFindTotalPages] = useState(0); // "찾아줘" 총 페이지 수
  const [foundTotalPages, setFoundTotalPages] = useState(0); // "찾았다" 총 페이지 수

  // 공통 데이터 로딩 함수
  const fetchData = async (url, setData, setPageCount) => {
    setLoading(true);
    try {
      const response = await api.get(url);
      setData(response.data.data.content);
      setPageCount(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(
      `/find-posts?page=${findPage}&size=8&status=FIND`,
      setFindPost,
      setFindTotalPages
    );
  }, [findPage]);

  useEffect(() => {
    fetchData(
      `/find-posts?page=${foundPage}&size=8&status=FOUND`,
      setFoundPost,
      setFoundTotalPages
    );
  }, [foundPage]);

  const handleFind = () => {
    setFindPage(0);
    fetchData(
      `/find-posts?page=${findPage}&size=8&status=FIND`,
      setFindPost,
      setFindTotalPages
    );
    setIsFindActive(true);
  };

  const handleFound = () => {
    setFoundPage(0);
    fetchData(
      `/find-posts?page=${foundPage}&size=8&status=FOUND`,
      setFoundPost,
      setFoundTotalPages
    );
    setIsFindActive(false);
  };

  const handlePageChange = (page) => {
    if (isFindActive) {
      if (page >= 0 && page < findTotalPages) setFindPage(page);
    } else {
      if (page >= 0 && page < foundTotalPages) setFoundPage(page);
    }
  };

  const handlePost = () => {
    if (!authState.isLoggedIn) {
      toast.warning("로그인이 필요합니다!");
      return;
    }
    navigate("/findmemepost", { replace: true });
  };

  return (
    <div className="findmeme">
      <div className="findmeme-btn">
        <div className="findmeme-btn-left">
          <button onClick={handleFind} className={isFindActive ? "active" : ""}>
            <CgSearch className="icon" size={32} /> 찾아줘
          </button>
          <button
            onClick={handleFound}
            className={!isFindActive ? "active" : ""}
          >
            <CgSearchFound className="icon" size={32} /> 찾았다
          </button>
        </div>
        <button className="findmeme-post-btn" onClick={handlePost}>
          글 등록
        </button>
      </div>
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
      {(isFindActive ? findTotalPages : foundTotalPages) > 1 && !loading && (
        <div className="pagination">
          {Array.from(
            { length: isFindActive ? findTotalPages : foundTotalPages },
            (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={
                  index === (isFindActive ? findPage : foundPage)
                    ? "active"
                    : ""
                }
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default FindMeme;
