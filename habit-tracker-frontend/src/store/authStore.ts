import { create } from "zustand";

const TOKEN_STORAGE_KEY = "habit_tracker_token";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  initializeAuthFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  login: (token: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    set({ token: null, isAuthenticated: false });
  },
  initializeAuthFromStorage: () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    set({ token, isAuthenticated: Boolean(token) });
  }
}));
