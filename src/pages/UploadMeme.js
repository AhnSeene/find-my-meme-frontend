import { useEffect, useState } from "react";
import api from "../contexts/api";
import axios from "axios";
import "./UploadMeme.css";
import { useNavigate } from "react-router-dom";
import { RiFolderUploadFill } from "react-icons/ri";

function UploadMeme() {
  const fileBaseUrl = process.env.REACT_APP_FILE_BASEURL;
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [Subcategories, setSubcategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileTags, setFileTags] = useState({});
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedFileIndices, setSelectedFileIndices] = useState([]);
  const [tagIdToNameMap, setTagIdToNameMap] = useState({}); // 태그 ID와 이름 간의 매핑

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/tags");
        const tagsData = response.data.data;

        // 태그 ID와 이름 매핑 생성
        const idToNameMap = tagsData.reduce((acc, tag) => {
          tag.subTags.forEach((subTag) => {
            acc[subTag.id] = subTag.name;
          });
          return acc;
        }, {});

        setTags(tagsData);
        setTagIdToNameMap(idToNameMap);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  // 파일 선택 시 처리
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const updatedPreviewUrls = [];
    const updatedTags = {};

    // 파일을 서버에 업로드하고 URL을 수신
    for (const [index, file] of selectedFiles.entries()) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const presignedUrl = await getPresignedUrl(file.name);
        if (!presignedUrl) {
          console.error("Failed to get presigned URL");
          continue;
        }
        console.log(presignedUrl);
        const uploadSuccess = await uploadFileToS3(file, presignedUrl);
        if (!uploadSuccess) {
          console.error("Failed to upload file to S3");
          continue;
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
          continue;
        }

        const fileUrl = `${fileBaseUrl}${uploadResponse.fileUrl}`;
        console.log("Full file URL:", fileUrl); // 최종 URL 확인
        updatedPreviewUrls.push(fileUrl);

        // 초기 태그 설정
        updatedTags[index] = [];
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    }

    setPreviewUrls(updatedPreviewUrls);
    setFileTags(updatedTags);
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

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    //선택한 카테고리의 서브태그를 설정
    const selectedTag = tags.find((tag) => tag.parentTag === category);
    setSubcategories(selectedTag ? selectedTag.subTags : []);
  };

  const handleSubcategoryChange = (subcategory) => {
    const newTags = { ...fileTags };
    selectedFileIndices.forEach((index) => {
      if (!newTags[index]) {
        newTags[index] = [];
      }

      // 서브카테고리 태그 ID 추가 (최대 3개)
      if (!newTags[index].includes(subcategory) && newTags[index].length < 3) {
        newTags[index].push(subcategory.id);
      }
    });
    setFileTags(newTags);
  };

  const selectAll = () => {
    setSelectedFileIndices(files.map((_, index) => index));
  };

  const deselectAll = () => {
    setSelectedFileIndices([]);
  };

  const handleCheckboxChange = (index) => {
    setSelectedFileIndices((prevIndices) => {
      if (prevIndices.includes(index)) {
        return prevIndices.filter((i) => i !== index);
      } else {
        return [...prevIndices, index];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFileIndices.length === 0) {
      alert("선택된 파일이 없습니다.");
      return;
    }

    // 상대 경로를 추출하는 함수
    const getRelativeUrl = (url) => {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.pathname; // pathname은 상대 경로를 포함
      } catch (error) {
        console.error("Invalid URL:", url);
        return url; // 기본적으로 원래 URL 반환
      }
    };
    try {
      // 모든 파일을 비동기로 업로드
      const uploadPromises = selectedFileIndices.map(async (file, index) => {
        // 파일을 서버에 업로드하고 URL을 얻기
        const relativeUrl = getRelativeUrl(previewUrls[index]).slice(1);
        console.log("relate", relativeUrl);

        // URL과 태그를 서버에 전송
        await api.post(
          "/meme-posts",
          {
            imageUrl: relativeUrl,
            tags: fileTags[index] || [],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });

      // 모든 업로드가 완료될 때까지 기다리기
      await Promise.all(uploadPromises);
      navigate("/", { replace: true });
      console.log("Upload Success");
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  const openModal = (url) => {
    setCurrentImage(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage(null);
  };

  const removeImage = (removeIndex) => {
    const updatedFiles = files.filter((_, index) => index !== removeIndex);
    const updatedPreviewUrls = previewUrls.filter(
      (_, index) => index !== removeIndex
    );

    // Blob URL 해제
    previewUrls[removeIndex] && URL.revokeObjectURL(previewUrls[removeIndex]);

    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviewUrls);

    const updatedTags = { ...fileTags };
    delete updatedTags[removeIndex];
    setFileTags(updatedTags);

    setSelectedFileIndices((prevIndices) =>
      prevIndices.filter((i) => i !== removeIndex)
    );
  };

  const removeTagFromFile = (fileIndex, tag) => {
    const updatedTags = { ...fileTags };
    if (updatedTags[fileIndex]) {
      updatedTags[fileIndex] = updatedTags[fileIndex].filter((t) => t !== tag);
      setFileTags(updatedTags);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="uploadmeme">
      <form onSubmit={handleSubmit}>
        <div className="upload-area">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
            required
          />
          <label htmlFor="fileInput">
            <button
              type="button"
              onClick={triggerFileInput}
              className="fileUpload-button"
            >
              <RiFolderUploadFill size={50} />
            </button>
            <span>
              {files.length === 0
                ? "선택된 파일 없음"
                : `파일 ${files.length}개`}
            </span>
          </label>

          {files.length > 0 && (
            <>
              <div className="notice">
                이미지를 클릭시 전체 사진을 볼 수 있습니다
              </div>
              <div className="upload-controls">
                <button type="button" onClick={selectAll}>
                  전체 선택
                </button>
                <button type="button" onClick={deselectAll}>
                  전체 취소
                </button>
              </div>
            </>
          )}
        </div>

        <div className="previews">
          {previewUrls.map((url, index) => (
            <div key={index} className="preview-item">
              <img
                src={url}
                alt={`Preview ${index}`}
                onClick={() => openModal(url)}
              />
              <input
                type="checkbox"
                checked={selectedFileIndices.includes(index)}
                onChange={() => handleCheckboxChange(index)}
                className="file-checkbox"
              />
              <button
                type="button"
                className="delete-button"
                onClick={() => removeImage(index)}
              >
                &times;
              </button>
              <div className="tags">
                {fileTags[index]?.map((tagId, tagIndex) => (
                  <span key={tagIndex} className="tag">
                    {tagIdToNameMap[tagId]}
                    <button
                      type="button"
                      onClick={() => removeTagFromFile(index, tagId)}
                    >
                      {" "}
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <img src={currentImage} alt="Full Preview" />
            </div>
          </div>
        )}
        <div className="show-tags">
          <span>태그</span>
          <select
            onChange={handleCategoryChange}
            value={selectedCategory}
            required
          >
            <option value="">대분류 선택</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.parentTag}>
                {tag.parentTag}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className="subcategories">
            {Subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className={`subcategory ${
                  Subcategories.includes(subcategory) ? "selected" : ""
                }`}
                onClick={() => handleSubcategoryChange(subcategory)}
              >
                {subcategory.name}
              </div>
            ))}
          </div>
        )}
        <button type="submit">등록</button>
      </form>
    </div>
  );
}

export default UploadMeme;
