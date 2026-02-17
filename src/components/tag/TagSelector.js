import { useState, useEffect } from "react";
import api from "../../contexts/api";
import "./TagSelector.css";
import useTagsStore from "../../store/useTagsStore";

function TagSelector({ selectedSubTags, setSelectedSubTags }) {
  const { tags, subTags, setTags, setSubTags } = useTagsStore();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/tags");
        setTags(response.data.data);
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    };
    if (tags.length === 0) {
      fetchTags();
    }
  }, []);

  const handleParentTagChange = (e) => {
    const categoryTag = tags.find((tag) => tag.parentTag === e.target.value);
    setSubTags(categoryTag ? categoryTag.subTags : []);
  };

  const handleSubTagClick = (subTagId) => {
    if (!selectedSubTags.includes(subTagId) && selectedSubTags.length < 3) {
      setSelectedSubTags([...selectedSubTags, subTagId]);
    }
  };

  const handleSubTagRemove = (subTagId) => {
    setSelectedSubTags(selectedSubTags.filter((id) => id !== subTagId));
  };

  return (
    <div className="tagselector">
      <div className="tagselector-top">
        <select id="tag-category" onChange={handleParentTagChange}>
          <option value="">태그</option>
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
                  # {tag.name}
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
      {subTags.length > 0 && (
        <div className="tag-buttons">
          {subTags.map((subTag) => (
            <button
              key={subTag.id}
              type="button"
              className={`tag-button ${
                selectedSubTags.includes(subTag.id)
                  ? "tag-button--selected"
                  : ""
              }`}
              onClick={() => handleSubTagClick(subTag.id)}
            >
              # {subTag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagSelector;
