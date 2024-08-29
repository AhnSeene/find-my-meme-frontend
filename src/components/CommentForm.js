import { useState, useMemo, useRef } from "react";
import api from "../contexts/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './commentform.css';

function CommentForm({ postId, onCommentAdded, replyingTo, onCancel }) {
  const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
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
        const response = await api.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = `${fileBaseUrl}${response.data.data.fileUrl}`;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", imageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    };
  };

  // 커스텀 이미지 핸들러를 툴바에 추가
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        ["link", { align: [] }, { color: [] }, { background: [] }],
        ["image"],  // 툴바에 이미지 버튼 추가
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload,  // 이미지 버튼 클릭 시 handleImageUpload 함수 실행
      },
    },
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editorValue.trim()) {
      return;
    }
    const plainText = quillRef.current.getEditor().getText();
    try {
      const response = await api.post(`/find-posts/${postId}/comments`, {
        postId: postId,
        htmlContent: editorValue,
        content: plainText,
        parentCommentId: replyingTo||null,
      });
      onCommentAdded(response.data.data, replyingTo);
      setEditorValue("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="comment-form-container">
      <form onSubmit={handleSubmit}>
        <ReactQuill
          ref={quillRef}
          value={editorValue}
          onChange={handleEditorChange}
          modules={modules}
          className="custom-quill-editor"
          placeholder="댓글을 작성하세요..."
        />
        <div className="comment-form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>취소</button>
          <button type="submit" className="submit-button">등록</button>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
