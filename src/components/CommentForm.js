import { useState, useMemo, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './commentform.css';

function CommentForm({postId, onCommentAdded, replyingTo}){
    const [editorValue, setEditorValue] = useState("");
    const quillRef = useRef(null);

    const handleEditorChange = (value) => {
        setEditorValue(value);
      };

      const handleImageUpload = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
    
        input.onchange = async () => {
          const file = input.files[0];
          const formData = new FormData();
          formData.append("file", file);
    
          try {
            const response = await axios.post("http://localhost:8080/api/v1/files/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
    
            const imageUrl = `http://localhost:8080${response.data.data.fileUrl}`;
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", imageUrl);
          } catch (error) {
            console.error("Failed to upload image:", error);
          }
        };
      };

    const handleCommentSubmit = async (e)=>{
        e.preventDefault();
        try{
            const response = await axios.post(`http://localhost:8080/api/v1/find-posts/${postId}/comments`, {
                content: editorValue,
                replyTo: replyingTo || null      
        });
        setEditorValue(""); // 에디터 내용 초기화
        onCommentAdded(response.data, replyingTo); // 새로 작성된 댓글을 상위 컴포넌트로 전달
        } catch(error){
            console.error('Error posting comment:',error);
        }
    };

    const modules = useMemo(() => ({
        toolbar: {
          container: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
          ],
          handlers: {
            image: handleImageUpload,
          },
        },
        clipboard: {
          matchVisual: false,
        },
      }), []);

      const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ];

    return(
        <form onSubmit={handleCommentSubmit} className="comment-form">
            <ReactQuill
                ref={quillRef}
                value={editorValue}
                onChange={handleEditorChange}
                modules={modules}
                formats={formats}
                placeholder="댓글을 작성하세요"
                className="comment-editor"
            />
            <button type="submit" className="comment-submit-btn">댓글 작성</button>
        </form>
    )
}
export default CommentForm;