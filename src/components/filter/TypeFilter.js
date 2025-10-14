import useMemesFilterStore from "../../store/useMemesFilterStore";
import "./TypeFilter.css";

export default function TypeFilter() {
  const mediaType = useMemesFilterStore((state) => state.mediaType);
  const setMediaType = useMemesFilterStore((state) => state.setMediaType);

  const filterOptions = [
    { value: "", label: "전체" },
    { value: "ANIMATED", label: "GIF" },
    { value: "STATIC", label: "사진" },
  ];

  return (
    <div className="type-filter">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setMediaType(option.value)}
          className={mediaType === option.value ? "active" : ""}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
