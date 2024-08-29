import { useState, useEffect } from "react";
import api from "../contexts/api";
import './admin.css'

function Admin() {
    const [tags, setTags] = useState([]);
    const [newParentTagName, setNewParentTagName] = useState("");
    const [newSubTags, setNewSubTags] = useState([""]); // 소분류 태그 초기값 빈 문자열 배열
    const [selectedParentTagId, setSelectedParentTagId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const response = await api.get("/tags");
            setTags(response.data.data);
        } catch (error) {
            console.error("Failed to fetch tags:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddParentTag = async () => {
        if (!newParentTagName) return;

        try {
            await api.post('/tags', {
                name: newParentTagName,
                slug: newParentTagName.toLowerCase().replace(/ /g, "-"),  // slug 자동 생성
                parentTagId: null
            });

            fetchTags();
        } catch (error) {
            console.error("Failed to add parent tag:", error);
        } finally {
            setNewParentTagName("");
        }
    };

    const handleSubTagChange = (index, value) => {
        const updatedSubTags = [...newSubTags];
        updatedSubTags[index] = value;
        setNewSubTags(updatedSubTags);
    };

    const handleAddSubTag = async () => {
        if (newSubTags.length === 0 || !selectedParentTagId) return;

        try {
            await Promise.all(newSubTags
                .filter(subTag => subTag.trim() !== "") // 빈 값 필터링
                .map(subTag => 
                    api.post('/tags', {
                        name: subTag,
                        slug: subTag.toLowerCase().replace(/ /g, "-"), // slug 자동 생성
                        parentTagId: selectedParentTagId
                    })
                )
            );

            fetchTags();
        } catch (error) {
            console.error("Failed to add sub-tags:", error);
        } finally {
            setNewSubTags([""]); // 초기화: 빈 문자열 배열로 리셋
            setSelectedParentTagId(null);
        }
    };

    const handleAddSubTagInput = () => {
        setNewSubTags([...newSubTags, ""]); // 새로운 입력 필드 추가
    };

    return (
        <div className="admin-tag-management">
            <h1>태그 관리</h1>

            {/* 대분류 추가 섹션 */}
            <div className="tag-creation">
                <h2>대분류 추가</h2>
                <input
                    type="text"
                    placeholder="대분류 이름"
                    value={newParentTagName}
                    onChange={(e) => setNewParentTagName(e.target.value)}
                />
                <button onClick={handleAddParentTag}>대분류 추가</button>
            </div>

            {/* 소분류 추가 섹션 */}
            <div className="sub-tag-creation">
                <h2>소분류 추가</h2>
                <select 
                    onChange={(e) => setSelectedParentTagId(e.target.value)} 
                    value={selectedParentTagId || ""}
                >
                    <option value="">대분류 선택</option>
                    {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>{tag.parentTag}</option>
                    ))}
                </select>

                {newSubTags.map((subTag, index) => (
                    <div key={index} className="sub-tag-input">
                        <input
                            type="text"
                            placeholder={`소분류 태그 ${index + 1}`}
                            value={subTag}
                            onChange={(e) => handleSubTagChange(index, e.target.value)}
                        />
                        {newSubTags.length > 1 && (
                            <button onClick={() => setNewSubTags(newSubTags.filter((_, i) => i !== index))}>
                                &times;
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={handleAddSubTagInput}>소분류 태그 입력칸 추가</button>
                <button onClick={handleAddSubTag}>소분류 태그 추가</button>
            </div>

            {/* 로딩 표시 */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="tag-list">
                    <h2>태그 목록</h2>
                    {tags.length > 0 ? (
                        tags.map((tag) => (
                            <div key={tag.id} className="tag-item">
                                <h3>{tag.parentTag}</h3>
                                {tag.subTags && tag.subTags.length > 0 && (
                                    <ul>
                                        {tag.subTags.map((subTag) => (
                                            <li key={subTag.id}>{subTag.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No tags available</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Admin;
