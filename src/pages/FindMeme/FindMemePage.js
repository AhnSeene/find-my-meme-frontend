import { useState, useEffect } from "react";
import api from "../../contexts/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./FindMemePage.css";
import useAuthStore from "../../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

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

const fetchPosts = async ({ queryKey }) => {
  const [_key, { page, status }] = queryKey;
  const res = await api.get(`/find-posts?page=${page}&size=8&status=${status}`);
  return res.data.data;
};

function FindMemePage() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isFindActive, setIsFindActive] = useState(true);
  const [findPage, setFindPage] = useState(0);
  const [foundPage, setFoundPage] = useState(0);

  const { data: findData, isLoading: isFindLoading } = useQuery({
    queryKey: ["findPosts", { page: findPage, status: "FIND" }],
    queryFn: fetchPosts,
    keepPreviousData: true, // 이전 페이지 데이터 유지
  });

  const { data: foundData, isLoading: isFoundLoading } = useQuery({
    queryKey: ["foundPosts", { page: foundPage, status: "FOUND" }],
    queryFn: fetchPosts,
    keepPreviousData: true, // 이전 페이지 데이터 유지
  });

  const handlePageChange = (page) => {
    if (isFindActive) setFindPage(page);
    else setFoundPage(page);
  };

  const handlePost = () => {
    if (!isLoggedIn) {
      toast.warning("로그인이 필요합니다!");
      return;
    }
    navigate("/findmemepost", { replace: true });
  };

  const handleFind = () => setIsFindActive(true);
  const handleFound = () => setIsFindActive(false);
  const activeData = isFindActive ? findData : foundData;
  const activeLoading = isFindActive ? isFindLoading : isFoundLoading;
  return (
    <div className="findmeme">
      <div className="findmeme-btn">
        <div className="findmeme-btn-left">
          <button onClick={handleFind} className={isFindActive ? "active" : ""}>
            {isFindActive ? (
              <img
                src="/question-on.svg"
                alt="물음표"
                className="question-img"
              />
            ) : (
              <img src="/question.svg" alt="물음표" className="question-img" />
            )}
          </button>
          <button
            onClick={handleFound}
            className={!isFindActive ? "active" : ""}
          >
            {!isFindActive ? (
              <img
                src="/exclamation-on.svg"
                alt="느낌표"
                className="exclamation-img"
              />
            ) : (
              <img
                src="/exclamation.svg"
                alt="느낌표"
                className="exclamation-img"
              />
            )}
          </button>
        </div>
        <button className="findmeme-post-btn" onClick={handlePost}>
          글 등록
        </button>
      </div>
      {activeLoading && <p>Loading...</p>}
      {activeData && activeData.content?.length > 0 ? (
        <div className="findmeme-posts">
          {activeData.content.map((post, index) => (
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
          ))}
        </div>
      ) : (
        <p>게시물이 없습니다다</p>
      )}

      {/* 페이지네이션션 */}
      <div className="pagination">
        {Array.from({ length: activeData?.totalPages || 0 }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={
              index === (isFindActive ? findPage : foundPage) ? "active" : ""
            }
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FindMemePage;
