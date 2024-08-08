import { useState } from "react";
import axios from 'axios';
import './UploadMeme.css';

const categories = {
    감정: ['귀여운', '화난', '웃긴', '슬픈', '놀란'],
    인사: ['안녕하세요', '감사합니다', '미안합니다', '새해인사', '생일 축하'],
    TV: ['무한도전', '기타']
};

function UploadMeme() {
    const [selectedCategory, setSelectedCategory] = useState(''); // 카테고리
    const [Subcategories, setSubcategories] = useState([]); // 카테고리 밑 서브 태그들
    const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그들
    const [files, setFiles] = useState([]); // 서버로 전송할 파일 목록
    const [fileTags, setFileTags] = useState({}); // 파일별 태그 저장
    const [previewUrls, setPreviewUrls] = useState([]); // 미리보기 사진
    const [isModalOpen, setIsModalOpen] = useState(false); // 크게 사진 확인
    const [currentImage, setCurrentImage] = useState(null);
    const [selectedFileIndices, setSelectedFileIndices] = useState([]); // 체크된 파일의 인덱스 목록

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files); // FileList를 배열로 변환
        setFiles(selectedFiles);

        // 미리보기 URL 생성
        const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(previewUrls);

        // 초기 태그 설정
        const initialTags = {};
        selectedFiles.forEach((_, index) => {
            initialTags[index] = [];
        });
        setFileTags(initialTags);
    }

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSubcategories(categories[category] || []);
    }

    const handleSubcategoryChange = (subcategory) => {
        const newTags = { ...fileTags }; // 기존 태그들 복사
        selectedFileIndices.forEach(index => {
            if (!newTags[index].includes(subcategory) && newTags[index].length < 3) {
                newTags[index].push(subcategory);
            } else if (newTags[index].includes(subcategory)) {
                newTags[index] = newTags[index].filter(tag => tag !== subcategory);
            }
        });
        setFileTags(newTags);
    }

    const selectAll = () => {
        setSelectedFileIndices(files.map((_,index)=> index));
    }
    
    const deselectAll = () => {
        setSelectedFileIndices([]);
    }

    const handleCheckboxChange = (index) => {
        setSelectedFileIndices(prevIndices => {
            if (prevIndices.includes(index)) {
                // 체크 해제
                return prevIndices.filter(i => i !== index);
            } else {
                // 체크 추가
                return [...prevIndices, index];
            }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        files.forEach((file, index) => {
            formData.append('files', file);
            formData.append(`tags[${index}]`, JSON.stringify(fileTags[index]));
        });

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Upload Success:', response.data);
        } catch (error) {
            console.error('Upload Error:', error);
        }
    };

    const openModal = (url) => {
        setCurrentImage(url);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentImage(null);
    }

    const removeImage = (removeIndex) => {
        const updatedFiles = files.filter((_, index) => index !== removeIndex);
        const updatedPreviewUrls = previewUrls.filter((_, index) => index !== removeIndex);

        // URL을 해제하여 메모리 누수 방지
        previewUrls[removeIndex] && URL.revokeObjectURL(previewUrls[removeIndex]);

        setFiles(updatedFiles);
        setPreviewUrls(updatedPreviewUrls);

        // 기존 태그 상태를 복사하여 업데이트합니다.
        const updatedTags = { ...fileTags };
        
        // 제거된 파일의 태그를 삭제합니다.
        delete updatedTags[removeIndex];
        
        // 업데이트된 태그 상태를 설정합니다.
        setFileTags(updatedTags);

        // 선택된 파일 인덱스 업데이트
        setSelectedFileIndices(prevIndices => prevIndices.filter(i => i !== removeIndex));
    }

    const removeTagFromFile = (fileIndex, tag) => {
        const updatedTags = { ...fileTags};
        if (updatedTags[fileIndex]) {
            updatedTags[fileIndex] = updatedTags[fileIndex].filter(t => t!==tag);
            setFileTags(updatedTags);
        }
    }

    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    }
    
    return (
        <div className="uploadmeme">
            <h1>짤 등록</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" multiple onChange={handleFileChange} style={{display: 'none'}} id="fileInput" required />
                <label htmlFor="fileInput">
                    <button type="button" onClick={triggerFileInput}>파일 선택</button>
                </label>
                <span>
                    {files.length === 0 ? '선택된 파일 없음' : `파일 ${files.length}개`}
                </span>
                <button onClick={selectAll}>전체 선택</button>
                <button onClick={deselectAll}>선택 취소</button>
                <div className="previews">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="preview-item">
                            <img src={url} alt={`Preview ${index}`} onClick={() => openModal(url)} />
                            <input
                                type="checkbox"
                                checked={selectedFileIndices.includes(index)}
                                onChange={() => handleCheckboxChange(index)}
                                className="file-checkbox"
                            />
                            <button
                                className="delete-button"
                                onClick={() => removeImage(index)}
                            >
                                &times;
                            </button>
                            <div className="tags">
                                {fileTags[index] && fileTags[index].map((tag, tagIndex) => (
                                    <span key={tagIndex} className="tag">
                                        {tag}
                                        <button onClick={() => removeTagFromFile(index, tag)}> &times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {isModalOpen && (
                    <div className="modal" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close" onClick={closeModal}>&times;</span>
                            <img src={currentImage} alt="Full Preview" />
                        </div>
                    </div>
                )}
                <div className="show-tags">
                    <select onChange={handleCategoryChange} value={selectedCategory} required>
                        <option value="">대분류 선택</option>
                        {Object.keys(categories).map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {selectedCategory && (
                    <div className="subcategories">
                        {categories[selectedCategory].map((subcategory) => (
                            <div 
                                key={subcategory}
                                className={`subcategory ${Subcategories.includes(subcategory) ? 'selected' : ''}`}
                                onClick={() => handleSubcategoryChange(subcategory)}
                            >
                                {subcategory}
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
