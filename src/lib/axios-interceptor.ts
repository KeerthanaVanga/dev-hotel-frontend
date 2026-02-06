import api from "./axios";
import refreshClient from "../api/refresh.api";

let refreshPromise: Promise<boolean> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshClient
            .post("/auth/refresh")
            .then(() => true)
            .catch(() => false);
        }

        const success = await refreshPromise;
        refreshPromise = null;

        if (!success) return Promise.reject(error);

        return api(originalRequest);
      } catch {
        refreshPromise = null;
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
