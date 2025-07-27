import "./ImageModal.css";

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={imageUrl} alt="Full Preview" />
      </div>
    </div>
  );
};
export default ImageModal;
