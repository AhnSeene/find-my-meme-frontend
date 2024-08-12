import { useEffect } from "react";
import { useParams } from "react-router-dom";

function FindMemeDetail (){
    const {id} = useParams();
    const [post,setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        }
        fetchPost();
    },[id]);

    if (!post) return <p>불러올 게시글이 없습니다</p>

    return(
        <div>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
        </div>
    )
}

export default FindMemeDetail;