"use client";

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// ================= AXIOS INSTANCE =================
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// ================= TYPES =================
type FailedRequest = {
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
  reject: (reason?: unknown) => void;
};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ================= REFRESH STATE =================
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// ================= QUEUE HANDLER =================
const processQueue = (error: unknown, response?: AxiosResponse) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (response) {
      prom.resolve(response);
    }
  });

  failedQueue = [];
};

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 🔴 Network error (no response)
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest.url || "";

    // 🔒 Avoid infinite loop for auth routes
    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/me");

    // ================= HANDLE 401 =================
    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        // ⏳ Queue requests while refreshing
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🔄 Refresh token (cookie-based)
        await api.post("/auth/refresh/");

        // 🔁 Retry original request first
        const retryResponse = await api(originalRequest);

        // ✅ Resolve queued requests with retry response
        processQueue(null, retryResponse);

        return retryResponse;
      } catch (err) {
        // ❌ Reject all queued requests
        processQueue(err);

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
