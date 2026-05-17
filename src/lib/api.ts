import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let queue: Array<{ resolve: () => void; reject: (error: unknown) => void }> =
  [];

const processQueue = (error: unknown) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  queue = [];
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
  withCredentials: true,
});
if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL environment variable is required");
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new Error(error.message + " try again later"));
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const is401 = error.response?.status === 401;
    const isAuthCall = originalRequest.url?.startsWith("/auth");
    const isMeCall = originalRequest.url === "/auth/me";
    const isRefreshCall = originalRequest.url === "/auth/refresh";
    const hasRetried = originalRequest._retry;

    if (!is401 || (isAuthCall && !isMeCall && !isRefreshCall) || hasRetried) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        queue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
