import { useState, useEffect } from "react";
import api from "../contexts/api";
import "../styles/common.css";

function TagSelector({ selectedSubTags, setSelectedSubTags }) {
  const [tags, setTags] = useState([]);
  const [currentSubTags,setCurrentSubTags]=useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/tags");
        setTags(response.data.data);
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    };
    fetchTags();
  }, []);

  const handleParentTagChange = (e) => {
    const categoryTag=tags.find((tag)=>tag.parentTag===e.target.value)
    setCurrentSubTags(categoryTag? categoryTag.subTags:[]);
  };

  const handleSubTagClick = (subTagId) => {
    if (!selectedSubTags.includes(subTagId) && selectedSubTags.length < 3) {
      setSelectedSubTags((prevSelected) => [...prevSelected, subTagId]);
    }
  };

  const handleSubTagRemove = (subTagId) => {
    setSelectedSubTags((prevSelected) =>
      prevSelected.filter((id) => id !== subTagId)
    );
  };

  return (
    <div className="findMemePost-tag">
      <div className="findMemePost-tag-top">
        <select onChange={handleParentTagChange}>
          <option value="">태그 카테고리를 선택하세요</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.parentTag}>
              {tag.parentTag}
            </option>
          ))}
        </select>
        {selectedSubTags.length > 0 && (
          <div className="selected-tags">
            {selectedSubTags.map((tagId) => {
              const tag = tags
                .flatMap((t) => t.subTags)
                .find((subTag) => subTag.id === tagId);
              return tag ? (
                <div key={tag.id} className="selected-tag">
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleSubTagRemove(tag.id)}
                  >
                    X
                  </button>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>
      {currentSubTags.length>0 && (
        <div className="tag-buttons">
          {currentSubTags.map((subTag) => (
            <button
              key={subTag.id}
              type="button"
              className={selectedSubTags.includes(subTag.id) ? "selected" : ""}
              onClick={() => handleSubTagClick(subTag.id)}
            >
              {subTag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagSelector;
