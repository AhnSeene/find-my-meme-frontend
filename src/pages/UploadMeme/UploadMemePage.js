import { useEffect, useState } from "react";
import api from "../../contexts/api";
import { useNavigate } from "react-router-dom";
import { RiFolderUploadFill } from "react-icons/ri";
import UploadTagSelector from "../../components/tag/UploadTagSelector";
import PreviewItem from "../../components/upload/PreviewItem";
import ImageModal from "../../components/modal/ImageModal";
import useFileUpload from "../../hooks/useFileUpload";
import "./UploadMemePage.css";

function UploadMemePage() {
  const {
    files,
    previewUrls,
    fileTags,
    updateProgress,
    handleFileChange,
    removeImage,
    setFileTags,
    selectedFileIndices,
    setSelectedFileIndices,
  } = useFileUpload();

  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [tagIdToNameMap, setTagIdToNameMap] = useState({}); // 태그 ID와 이름 간의 매핑

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/tags");
        const tagsData = response.data.data;
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
      if (
        !newTags[index].some((tagId) => tagId === subcategory.id) &&
        newTags[index].length < 3
      ) {
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
      const uploadPromises = selectedFileIndices.map(async (fileIndex) => {
        // 파일을 서버에 업로드하고 URL을 얻기
        const relativeUrl = getRelativeUrl(previewUrls[fileIndex]).slice(1);

        // URL과 태그를 서버에 전송
        await api.post(
          "/meme-posts",
          {
            imageUrl: relativeUrl,
            tags: fileTags[fileIndex] || [],
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
            <PreviewItem
              key={index}
              url={url}
              index={index}
              isSelected={selectedFileIndices.includes(index)}
              onCheckboxChange={handleCheckboxChange}
              onDelete={removeImage}
              tags={fileTags[index] || []}
              tagIdToNameMap={tagIdToNameMap}
              onTagRemove={removeTagFromFile}
              onImageClick={openModal}
              uploadProgress={updateProgress[index]}
            />
          ))}
        </div>
        <ImageModal
          isOpen={isModalOpen}
          imageUrl={currentImage}
          onClose={closeModal}
        />
        <UploadTagSelector
          tags={tags}
          selectedCategory={selectedCategory}
          subcategories={subcategories}
          handleCategoryChange={handleCategoryChange}
          handleSubcategoryChange={handleSubcategoryChange}
        />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}

export default UploadMemePage;
