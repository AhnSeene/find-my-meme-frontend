import React from "react";
import "./UploadTagSelector.css";

const UploadTagSelector = ({
  tags,
  selectedCategory,
  subcategories,
  handleCategoryChange,
  handleSubcategoryChange,
}) => {
  return (
    <div className="UploadTagSelector">
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
          {subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="subcategory"
              onClick={() => handleSubcategoryChange(subcategory)}
            >
              {subcategory.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default UploadTagSelector;
