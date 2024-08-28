import { useState, useEffect } from "react";
import api from "../contexts/api";
import '../styles/common.css';

function TagSelector({ selectedSubTags, setSelectedSubTags }) {
    const [tags, setTags] = useState([]);
    const [selectedParentTag, setSelectedParentTag] = useState("");

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await api.get('http://localhost:8080/api/v1/tags');
                setTags(response.data.data);
            } catch (error) {
                console.error("Failed to load tags:", error);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        if (tags.length > 0) {
            const parentTag = tags.find(tag => tag.subTags.some(subTag => selectedSubTags.includes(subTag.id)));
            setSelectedParentTag(parentTag ? parentTag.parentTag : "");
        }
    }, [tags, selectedSubTags]);

    const currentSubTags = tags
        .find(tag => tag.parentTag === selectedParentTag)?.subTags || [];

    const handleParentTagChange = (e) => {
        setSelectedParentTag(e.target.value);
    };

    const handleSubTagClick = (subTagId) => {
        if (!selectedSubTags.includes(subTagId) && selectedSubTags.length < 3) {
            setSelectedSubTags((prevSelected) => [...prevSelected, subTagId]);
        }
    };

    const handleSubTagRemove = (subTagId) => {
        setSelectedSubTags((prevSelected) => prevSelected.filter(id => id !== subTagId));
    };

    return (
        <div className="findMemePost-tag">
            <div className="findMemePost-tag-top">
                <select value={selectedParentTag} onChange={handleParentTagChange}>
                    <option value="">태그 카테고리를 선택하세요</option>
                    {tags.map(tag => (
                        <option key={tag.id} value={tag.parentTag}>{tag.parentTag}</option>
                    ))}
                </select>
                {selectedSubTags.length > 0 && (
                    <div className="selected-tags">
                        {selectedSubTags.map(tagId => {
                            const tag = tags.flatMap(t => t.subTags).find(subTag => subTag.id === tagId);
                            return tag ? (
                                <div key={tag.id} className="selected-tag">
                                    {tag.name}
                                    <button type="button" onClick={() => handleSubTagRemove(tag.id)}>X</button>
                                </div>
                            ) : null;
                        })}
                    </div>
                )}
            </div>
            {selectedParentTag && (
                <div className="tag-buttons">
                    {currentSubTags.map(subTag => (
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
