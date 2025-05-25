import { create } from "zustand";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  token: null,
  username: null,

  login: (token, username) => {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("username", username);
    set({ isLoggedIn: true, token, username });
  },

  logout: () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    set({ isLoggedIn: false, token: null, username: null });
  },
  restoreAuth: () => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedUsername = localStorage.getItem("username");
    if (storedToken && storedUsername) {
      set({ isLoggedIn: true, token: storedToken, username: storedUsername });
    }
  },
}));
