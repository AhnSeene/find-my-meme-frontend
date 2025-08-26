import useMemesFilterStore from "../../store/useMemesFilterStore";
import "./TypeFilter.css";

export default function TypeFilter() {
  const mediaType = useMemesFilterStore((state) => state.mediaType);
  const setMediaType = useMemesFilterStore((state) => state.setMediaType);

  return (
    <div className="type-filter">
      <button
        type="button"
        onClick={() => setMediaType("")}
        className={mediaType == "" ? "active" : ""}
      >
        전체
      </button>
      <button
        type="button"
        onClick={() => setMediaType("ANIMATED")}
        className={mediaType == "ANIMATED" ? "active" : ""}
      >
        GIF
      </button>
      <button
        type="button"
        onClick={() => setMediaType("STATIC")}
        className={mediaType == "STATIC" ? "active" : ""}
      >
        사진
      </button>
    </div>
  );
}
