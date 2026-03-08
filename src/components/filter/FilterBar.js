import TagSelector from "../tag/TagSelector";
import TypeFilter from "./TypeFilter";
import useMemesFilterStore from "../../store/useMemesFilterStore";
import "./FilterBar.css";

export default function FilterBar() {
  const { selectedSubTags, setSelectedSubTags } = useMemesFilterStore();

  return (
    <div className="filter-bar">
      <div className="tag-selector">
        <TagSelector
          selectedSubTags={selectedSubTags}
          setSelectedSubTags={setSelectedSubTags}
        />
      </div>
      <div className="type-filter-wrapper">
        <TypeFilter />
      </div>
    </div>
  );
}
