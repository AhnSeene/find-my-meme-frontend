import { create } from "zustand";

const useMemesFilterStore = create((set) => ({
  selectedSubTags: [],
  mediaType: "",
  setSelectedSubTags: (newTags) => set({ selectedSubTags: newTags }),
  setMediaType: (type) => set({ mediaType: type }),
  resetFilters: () => set({ selectedSubTags: [], mediaType: "" }),
}));
export default useMemesFilterStore;
