import { useState, useMemo, useRef } from "react";
import api from "../../contexts/api";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./commentform.css";

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

      try {
        const presignedUrl = await getPresignedUrl(file.name);
        if (!presignedUrl) {
          console.error("Failed to get presigned URL");
        }
        console.log(presignedUrl);
        const uploadSuccess = await uploadFileToS3(file, presignedUrl);
        if (!uploadSuccess) {
          console.error("Failed to upload file to S3");
        }

        const { width, height } = await getImageDimensions(file);

        const fileMeta = {
          originalFilename: file.name,
          presignedUrl: presignedUrl.split("?")[0],
          width,
          height,
          size: file.size,
        };

        const uploadResponse = await completeUpload(fileMeta);
        if (!uploadResponse) {
          console.error("Failed to complete file upload");
        }

        const imageUrl = `${fileBaseUrl}${uploadResponse.fileUrl}`;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", imageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    };
  };

  const getPresignedUrl = async (filename) => {
    try {
      const response = await api.post(
        `/files/presigned-upload?filename=${encodeURIComponent(filename)}`,
        {},
        {}
      );

      return response.data.data.presignedUrl;
    } catch (error) {
      console.error("Error fetching presigned URL:", error);
      return null;
    }
  };

  const uploadFileToS3 = async (file, presignedUrl) => {
    try {
      const response = await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        withCredentials: true,
      });

      return response.status === 200;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      return false;
    }
  };

  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
    });
  };

  const completeUpload = async (fileMeta) => {
    try {
      const response = await api.post("/files/upload-complete", fileMeta, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error completing upload:", error);
      return null;
    }
  };

  // 커스텀 이미지 핸들러를 툴바에 추가
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          ["link", { align: [] }, { color: [] }, { background: [] }],
          ["image"], // 툴바에 이미지 버튼 추가
          ["clean"],
        ],
        handlers: {
          image: handleImageUpload, // 이미지 버튼 클릭 시 handleImageUpload 함수 실행
        },
      },
    }),
    []
  );

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
        parentCommentId: replyingTo || null,
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
          <button type="button" className="cancel-button" onClick={onCancel}>
            취소
          </button>
          <button type="submit" className="submit-button">
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
