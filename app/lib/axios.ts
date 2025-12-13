import axios from "axios";
import { API_BASE_URL } from "../constants/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (only on client side)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors for authenticated routes only
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const isAuthRoute =
        currentPath === "/login" ||
        currentPath === "/signup" ||
        currentPath === "/verify-email" ||
        currentPath.startsWith("/course/") ||
        currentPath.startsWith("/topic/") ||
        currentPath === "/";

      // Only handle logout for authenticated routes
      if (!isAuthRoute) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        // Use history.pushState to avoid page reload
        window.history.pushState({}, "", "/login");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    }
    return Promise.reject(error);
  }
);
