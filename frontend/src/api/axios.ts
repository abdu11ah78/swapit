import axios from "axios";
import { clearAccessToken, getAccessToken } from "@/lib/auth-storage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7052/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth pages where we should NOT auto-redirect on 401 (let the page handle the error)
const AUTH_PATHS = ["/login", "/signup", "/admin/login"];

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const isAuthPage =
        typeof window !== "undefined" &&
        AUTH_PATHS.some((p) => window.location.pathname.startsWith(p));

      if (!isAuthPage) {
        clearAccessToken();
        if (typeof window !== "undefined") {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("currentUser");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);
