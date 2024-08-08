import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css'

const categories = {
    감정: ['귀여운', '화난', '웃긴', '슬픈', '놀란'],
    인사: ['안녕하세요', '감사합니다', '미안합니다', '새해인사', '생일 축하'],
    TV: ['무한도전', '기타']
};

function Home() {
    const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리
    const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그들(최대 3개)
    const [images, setImages] = useState([]); // 이미지 데이터
    
    useEffect(() => {
        // 태그가 변경될 때마다 서버에 필터링된 이미지 요청
        const fetchImages = async () => {
            try {
                const params = selectedTags.length > 0 ? {tags: selectedTags.join(',')} : {}
                const response = await axios.get('/api/images',{ params });
                setImages(response.data.images);
            }catch (error) {
                console.error('이미지를 불러오는데 실패하였습니다',error);
            }
        };
        fetchImages();
    },[selectedTags]);

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
    }

    const handleTagChange = (tag) => {
        setSelectedTags(prevTags => {
            if (prevTags.includes(tag)) {
                return prevTags.filter(t => t !== tag); // 이미 포함된 경우 제거
            } else if (prevTags.length < 3) {
                return [...prevTags, tag]; // 포함되지 않은 경우 추가
            } else {
                return prevTags; // 최대 선택 수 초과시 변경 없음
            }
        });
    }

    return (
        <div className="Home">
            <div className="show-tags">
                <select onChange={handleCategoryChange} value={selectedCategory} required>
                    <option value="">대분류 선택</option>
                    {Object.keys(categories).map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <div className='selected-tags'>
                    {selectedTags.map((tag) => (
                        <div key={tag} className='selected-tag'>{tag}</div>
                        
                    ))}
                </div>
            </div>

            {selectedCategory && (
                <div className="subcategories">
                    {categories[selectedCategory].map((tag) => (
                        <div 
                            key={tag}
                            className={`subcategory ${selectedTags.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleTagChange(tag)}
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            )}

            {/* 이미지 필터링 및 표시 */}
            <div className='images'>
                {images.map((image, index) => (
                    <img key={index} src={image.url} alt={`Tag: ${image.tags.join(', ')}`} />
                ))}
            </div>
        </div>
    );
}

export default Home;
