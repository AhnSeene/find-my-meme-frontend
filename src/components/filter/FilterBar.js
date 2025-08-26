import TagSelector from "../tag/TagSelector";
import TypeFilter from "./TypeFilter";
import "./FilterBar.css";

export default function FilterBar() {
  return (
    <div className="filter-bar">
      <div className="tag-selector">
        <TagSelector />
      </div>
      <div className="type-filter">
        <TypeFilter />
      </div>
    </div>
  );
}
