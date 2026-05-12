// "use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { registerUser, loginUser } from "@/shared/api/auth.api";
// import { useAuthStore } from "../store/auth.store";
// import { showSuccess, showError } from "@/shared/utils/toast";
// import api from "@/shared/api/client";
// /**
//  * Robust helper to extract error messages from Django/Axios responses.
//  * Handles nested field errors, detail strings, and generic messages.
//  */
// function getApiErrorMessage(err: unknown, fallback: string): string {
//   const responseData = (err as any)?.response?.data;

//   if (responseData && typeof responseData === "object") {
//     // 1. Check for nested field errors (e.g., data.email: ["..."])
//     // Your backend sends errors inside the 'data' or 'errors' key
//     const fieldErrors = responseData.data || responseData.errors;

//     if (fieldErrors && typeof fieldErrors === "object") {
//       const firstError = Object.values(fieldErrors).flat().find((msg) => typeof msg === "string");
//       if (firstError) return firstError as string;
//     }

//     // 2. Check for common Django keys
//     if (typeof responseData.detail === "string") return responseData.detail;
//     if (typeof responseData.message === "string") return responseData.message;
//   }

//   return fallback;
// }

// // ================= REGISTER =================
// export const useRegister = () => {
//   const setAuth = useAuthStore((s) => s.setAuth);
//   const router = useRouter();

//   return useMutation({
//     mutationFn: registerUser,

//     onSuccess: async (res: any) => {
//       const user = res?.data?.data?.user || res?.data?.user || res?.data;
//       if (user && typeof user === "object") {
//         setAuth(user); // ✅ save user so onboarding knows who they are
//       }
//       showSuccess("Account created! Let's set up your profile.");
//       console.log("Routing to onboarding, ", user)
//       router.push("/onboarding"); // ✅ Register → Onboarding
//     },

//     onError: (err: unknown) => {
//       console.error("❌ REGISTER ERROR", err);
//       showError(getApiErrorMessage(err, "Registration failed. Please try again."));
//     },
//   });
// };

// // ================= LOGIN =================
// export const useLogin = () => {
//   const setAuth = useAuthStore((s) => s.setAuth);
//   const router = useRouter();

//   return useMutation({
//     mutationFn: loginUser,

//     onSuccess: (res: any) => {
//       console.log("🔥 LOGIN RESPONSE:", res);

//       const user = res?.data?.data?.user || res?.data?.user || res?.data;

//       if (!user || typeof user !== "object") {
//         console.error("❌ USER DATA MISSING IN RESPONSE", res);
//         showError("Invalid login response from server");
//         return;
//       }

//       setAuth(user);
//       showSuccess("Welcome back!");
//       router.push("/dashboard"); // ✅ Login → Dashboard (skip onboarding)
//     },

//     onError: (err: unknown) => {
//       console.error("❌ LOGIN ERROR", err);
//       showError(getApiErrorMessage(err, "Login failed"));
//     },
//   });
// };

// // ================= LOGOUT =================
// export const useLogout = () => {
//   const setAuth = useAuthStore((s) => s.setAuth);
//   const queryClient = useQueryClient();
//   const router = useRouter();

//   return useMutation({
//     // mutationFn: async () => {
//     //   // ✅ Raw fetch — completely bypasses axios interceptor
//     //   // This prevents the refresh → logout → refresh loop
//     //   await fetch("http://localhost:8000/api/v1/auth/logout/", {
//     //     method: "POST",
//     //     credentials: "include", // sends cookies so Django can blacklist + clear them
//     //   });
//     // },
//     mutationFn: async () => {
//     // Use the same variable as Axios
//       const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

//       await fetch(`${baseUrl}/auth/logout/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // Required to send the session/refresh cookies to Django
//         credentials: "include", 
//       });
//     },

//     onSuccess: () => {
//       setAuth(null);
//       queryClient.clear(); // ✅ wipe ALL cached queries so nothing re-fetches
//       showSuccess("Logged out successfully");
//       router.push("/login");
//     },

//     onError: () => {
//       // Even if logout fails, clear everything locally
//       setAuth(null);
//       queryClient.clear(); // ✅ wipe cache here too
//       router.push("/login");
//     },
//   });
// };







"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/shared/api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { showSuccess, showError } from "@/shared/utils/toast";
import Cookies from "js-cookie"; // ✅ import
import api from "@/shared/api/client";

function getApiErrorMessage(err: unknown, fallback: string): string {
  const responseData = (err as any)?.response?.data;

  if (responseData && typeof responseData === "object") {
    const fieldErrors = responseData.data || responseData.errors;

    if (fieldErrors && typeof fieldErrors === "object") {
      const firstError = Object.values(fieldErrors).flat().find((msg) => typeof msg === "string");
      if (firstError) return firstError as string;
    }

    if (typeof responseData.detail === "string") return responseData.detail;
    if (typeof responseData.message === "string") return responseData.message;
  }

  return fallback;
}

// ================= REGISTER =================
export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,

    onSuccess: async (res: any) => {
      const user = res?.data?.data?.user || res?.data?.user || res?.data;
      if (user && typeof user === "object") {
        setAuth(user);
      }

      // ✅ Set logged_in cookie on frontend domain
      Cookies.set("logged_in", "true", {
        expires: 7,
        sameSite: "lax",
        secure: true,
      });

      showSuccess("Account created! Let's set up your profile.");
      router.push("/onboarding");
    },

    onError: (err: unknown) => {
      console.error("❌ REGISTER ERROR", err);
      showError(getApiErrorMessage(err, "Registration failed. Please try again."));
    },
  });
};

// ================= LOGIN =================
export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (res: any) => {
      console.log("🔥 LOGIN RESPONSE:", res);

      const user = res?.data?.data?.user || res?.data?.user || res?.data;

      if (!user || typeof user !== "object") {
        console.error("❌ USER DATA MISSING IN RESPONSE", res);
        showError("Invalid login response from server");
        return;
      }

      setAuth(user);

      // ✅ Set logged_in cookie on frontend domain so middleware can read it
      Cookies.set("logged_in", "true", {
        expires: 7,
        sameSite: "lax",
        secure: true,
      });

      showSuccess("Welcome back!");
      router.push("/dashboard");
    },

    onError: (err: unknown) => {
      console.error("❌ LOGIN ERROR", err);
      showError(getApiErrorMessage(err, "Login failed"));
    },
  });
};

// ================= LOGOUT =================
export const useLogout = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

      await fetch(`${baseUrl}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    },

    onSuccess: () => {
      setAuth(null);
      queryClient.clear();

      // ✅ Clear logged_in cookie from frontend domain
      Cookies.remove("logged_in");

      showSuccess("Logged out successfully");
      router.push("/login");
    },

    onError: () => {
      setAuth(null);
      queryClient.clear();

      // ✅ Clear even on error
      Cookies.remove("logged_in");

      router.push("/login");
    },
  });
};