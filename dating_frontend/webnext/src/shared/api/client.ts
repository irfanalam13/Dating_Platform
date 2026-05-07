// "use client";

// import axios, {
//   AxiosError,
//   AxiosInstance,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";

// // ================= AXIOS INSTANCE =================
// const api: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// // ================= TYPES =================
// type FailedRequest = {
//   resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
//   reject: (reason?: unknown) => void;
// };

// interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// // ================= STATE =================
// let isRefreshing = false;
// let failedQueue: FailedRequest[] = [];

// // ================= CSRF TOKEN =================
// function getCSRFToken(): string {
//   if (typeof document === "undefined") return "";
//   const match = document.cookie.match(/csrftoken=([^;]+)/);
//   return match ? match[1] : "";
// }

// // ================= REQUEST INTERCEPTOR =================
// api.interceptors.request.use((config) => {
//   // 1. Handle CSRF Token
//   const csrfToken = getCSRFToken();
//   if (csrfToken) {
//     config.headers = config.headers || {};
//     config.headers["X-CSRFToken"] = csrfToken;
//   }

//   // 2. Extract JWT Access Token from cookies
//   const getAccessToken = () => {
//     if (typeof document === "undefined") return "";
//     const match = document.cookie.match(/(^|;)\s*access\s*=\s*([^;]+)/);
//     return match ? match[2] : "";
//   };

//   const accessToken = getAccessToken();

//   // 3. Inject the token into the Authorization header for Django
//   if (accessToken) {
//     config.headers["Authorization"] = `Bearer ${accessToken}`;
//   }

//   return config;
// });

// // ================= QUEUE PROCESSOR =================
// const processQueue = (error: unknown, response?: AxiosResponse) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else if (response) prom.resolve(response);
//   });

//   failedQueue = [];
// };

// // ================= RESPONSE INTERCEPTOR =================
// api.interceptors.response.use(
//   (response) => response,

//   async (error: AxiosError) => {
//     const originalRequest = error.config as CustomAxiosRequestConfig;

//     // network error
//     if (!error.response || !originalRequest) {
//       return Promise.reject(error);
//     }

//     const status = error.response.status;
//     const url = originalRequest.url || "";

//     // prevent auth loop
//     const isAuthRoute =
//       url.includes("/auth/login") ||
//       url.includes("/auth/register") ||
//       url.includes("/auth/refresh") ||
//       url.includes("/auth/me");

//     // ================= HANDLE 401 =================
//     if (status === 401 && !originalRequest._retry && !isAuthRoute) {
//       if (isRefreshing) {
//         return new Promise<AxiosResponse>((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then(() => api(originalRequest))
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // refresh token (cookie-based)
//         await api.post("/auth/refresh/");

//         // retry original request
//         const response = await api(originalRequest);

//         processQueue(null, response);

//         return response;
//       } catch (err) {
//         processQueue(err);

//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }

//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;















"use client";

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "https://dating-platform-backend.onrender.com/api/v1",
//   withCredentials: true, // This ensures EVERY request sends cookies
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

const api = axios.create({
  // Force it to local Django. Use localhost, NEVER 127.0.0.1
  baseURL: "http://localhost:8000/api/v1", 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= TYPES & STATE =================
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: { resolve: (val: any) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    // Read CSRF token (CSRF is NOT HttpOnly, so JS can read it)
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    if (match) {
      config.headers["X-CSRFToken"] = match[1];
    }
  }
  // Notice: No Authorization header needed! Django reads the cookie.
  return config;
});



// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest.url || "";

    const isAuthRoute =
      url.includes("/auth/login/") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh/") ||  // ✅ || here
      url.includes("/auth/logout/") ||
      url.includes("/auth/me/") ;    // ✅ and no trailing slash needed

    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh/");
        processQueue(null);
        isRefreshing = false; // ✅ reset before retry
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        if (typeof window !== "undefined") {
          console.error("REFRESH FAILED - FORCING LOGOUT", refreshError); // ✅ log actual error
          localStorage.clear();
          sessionStorage.clear();

          // ✅ Let server clear HttpOnly cookies
          await fetch("http://localhost:8000/api/v1/auth/logout/", {
            method: "POST",
            credentials: "include",  // sends the cookies so Django can blacklist + clear them
          }).catch(() => {});
          window.location.replace("/login");
          return new Promise(() => {});
        }

        return Promise.reject(refreshError);
      }
      // ✅ no finally block needed
    }

    return Promise.reject(error);
  }
);

export default api;