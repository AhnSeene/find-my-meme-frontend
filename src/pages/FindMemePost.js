import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TagSelector from "../components/TagSelector";
import api from "../contexts/api";
import axios from "axios";

function FindMemePost() {
  const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
  const [selectedSubTags, setSelectedSubTags] = useState([]);
  const [editorValue, setEditorValue] = useState("");
  const [title, setTitle] = useState("");
  const quillRef = useRef(null);
  const navigate = useNavigate();

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
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
        console.error("Failed to upload image:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const plainText = quillRef.current.getEditor().getText();

    try {
      const response = await api.post(
        "/find-posts",
        {
          title: title,
          htmlContent: editorValue,
          content: plainText,
          tags: selectedSubTags,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        navigate(`/findmeme/${response.data.data.id}`);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className="findMemePost">
      <h2>새 글 작성</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={handleTitleChange}
          required
        />
        <ReactQuill
          ref={quillRef}
          value={editorValue}
          onChange={handleEditorChange}
          modules={modules}
          formats={formats}
          placeholder="내용을 입력하세요"
          className="custom-editor"
        />
        <TagSelector
          selectedSubTags={selectedSubTags}
          setSelectedSubTags={setSelectedSubTags}
          isWritingMode={true}
        />
        <button className="findMemePost-btn" type="submit">
          등록
        </button>
      </form>
    </div>
  );
}

export default FindMemePost;
