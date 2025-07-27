import React from "react";
import "./PreviewItem.css";
const PreviewItem = ({
  url,
  index,
  isSelected,
  onCheckboxChange,
  onDelete,
  tags,
  tagIdToNameMap,
  onTagRemove,
  onImageClick,
  uploadProgress,
}) => {
  return (
    <div className="preview-item">
      <img
        src={url}
        alt={`Preview ${index}`}
        onClick={() => onImageClick(url)}
      />
      {typeof uploadProgress === "number" && (
        <div className="progress-wrapper">
          <div
            className="progress-bar"
            style={{ width: `${uploadProgress}%` }}
          />
          <div className="progress-text">{uploadProgress}%</div>
        </div>
      )}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onCheckboxChange(index)}
        className="file-checkbox"
      />
      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(index)}
      >
        &times;
      </button>
      <div className="tags">
        {tags.map((tagId, tagIndex) => (
          <span key={tagIndex} className="tag">
            {tagIdToNameMap[tagId]}
            <button type="button" onClick={() => onTagRemove(index, tagId)}>
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default PreviewItem;
