import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

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
  timeout: (() => {
    const raw = parseInt(import.meta.env.VITE_API_TIMEOUT ?? "", 10);
    return Number.isFinite(raw) && raw > 0 ? raw : 15000;
  })(),
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
    const isCartCall = originalRequest.url?.startsWith("/cart");
    const isWishlistCall = originalRequest.url?.startsWith("/wishlist");
    const isCartOrWishlistCall = isCartCall || isWishlistCall;
    const hasRetried = originalRequest._retry;

    // Never try to refresh in response to a refresh call failing.
    // Otherwise the request can get stuck behind the refresh queue.
    if (isRefreshCall) {
      return Promise.reject(error);
    }

    if (!is401 || (isAuthCall && !isMeCall) || hasRetried) {
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

      // Special-case: `/auth/me` is used to detect auth state.
      // When the user is simply logged out, we should not treat it as an
      // "expired session" or force navigation.
      if (isMeCall) {
        return Promise.reject(error);
      }

      // Special-case: let cart/wishlist hooks show their own
      // "Please log in" toast + router navigation.
      if (isCartOrWishlistCall) {
        return Promise.reject(error);
      }

      toast.error("Session expired. Please log in again.");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
