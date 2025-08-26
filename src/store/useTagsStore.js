import { create } from "zustand";

const useTagsStore = create((set) => ({
  tags: [],
  subTags: [],
  setTags: (tags) => set({ tags }),
  setSubTags: (subTags) => set({ subTags }),
}));

export default useTagsStore;
