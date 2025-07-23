import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      username: null,

      login: (token, username) => {
        set({ isLoggedIn: true, token, username });
      },

      logout: () => {
        set({ isLoggedIn: false, token: null, username: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        token: state.token,
        username: state.username,
      }),
    }
  )
);

export default useAuthStore;
