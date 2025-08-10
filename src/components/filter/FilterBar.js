import TagSelector from "../tag/TagSelector";
import TypeFilter from "./TypeFilter";

export default function FilterBar() {
  return (
    <div className="filter-bar">
      <TagSelector />
      <TypeFilter />
    </div>
  );
}
