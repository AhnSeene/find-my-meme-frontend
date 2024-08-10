import { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './findmeme.css';


function FindMeme(){
    const navigate = useNavigate();
    const [findPost,setFindPost] = useState([]);
    const [foundPost,setFoundPost] = useState([]);
    const [isFindActive,setIsFindActive] = useState(true);
    const [loading,setLoading]=useState(false);

    // 더미 데이터
    const mockFindPost = [
        {
            id:1,
            title: "더미 찾아줘 밈 1",
            content: "이것은 첫 번째 밈의 내용입니다. 길이가 길 수 있습니다. 더 길어질 수 있습니다. 그래서 일부만 보여줄 것입니다.",
            imageUrl: "https://via.placeholder.com/150"
        },
        {
            id: 2,
            title: "더미 찾아줘 밈 2",
            content: "두 번째 밈의 간단한 내용입니다.",
            imageUrl: null
        },
        {
            id: 3,
            title: "더미 찾아줘 밈 3",
            content: "세 번째 밈의 간단한 내용입니다.",
            imageUrl: "https://via.placeholder.com/150"
        },
    ];

    const mockFoundPost = [
        {
            id: 4,
            title: "더미 찾았다 밈 1",
            content: "첫 번째 찾았다 밈의 간단한 내용입니다.",
            imageUrl: null
        },
        {
            id: 5,
            title: "더미 찾았다 밈 2",
            content: "두 번째 찾았다 밈의 간단한 내용입니다.",
            imageUrl: "https://via.placeholder.com/150"
        },
    ];

    // // 공통 데이터 로딩 함수
    // const fetchData = async (url, setData) => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(url);
    //         setData(response.data);
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        // fetchData('/api/find', setFindPost);
        setFindPost(mockFindPost);
    }, []);

    const handleFind = () => {
        // fetchData('/api/find', setFindPost);
        setFindPost(mockFindPost);
        setIsFindActive(true);
    }

    const handleFound = () => {
        // fetchData('/api/found', setFoundPost);
        setFoundPost(mockFoundPost);
        setIsFindActive(false);
    }

    const handlePost = () => {
        navigate('/findmemepost',{replace:true})
    }

    const truncateContent = (content,maxLength) => {
        if(content.length <= maxLength) {
            return content;
        }
        return content.slice(0, maxLength) + '...';
    }

    return(
        <div className="findmeme">
            <div>
                <button onClick={handleFind}>찾아줘</button>
                <button onClick={handleFound}>찾았다</button>
            </div>
            <button onClick={handlePost}>글 등록</button>
            <div>
                {loading && <p>Loading...</p>}
                {isFindActive ? (
                    <div className="findmeme-posts">
                        {findPost.length > 0 ? (
                            findPost.map((post, index) => (
                                <div key={index} className="post-summary">
                                    <Link to={`/post/${post.id}`}>
                                        <h3>{post.title}</h3>
                                        <p>{truncateContent(post.content, 20)}</p>
                                        {post.imageUrl && <img src={post.imageUrl} alt={post.title} width="100" />}
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
                                    <Link to={`/post/${post.id}`}>
                                        <h3>{post.title}</h3>
                                        {post.imageUrl && <img src={post.imageUrl} alt={post.title} width="100" />}
                                        <p>{truncateContent(post.content, 100)}</p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p>찾았다 게시물 없음</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FindMeme;