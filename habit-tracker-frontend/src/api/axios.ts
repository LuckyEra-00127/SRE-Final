import axios from "axios";
import { useAuthStore } from "../store/authStore";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);
