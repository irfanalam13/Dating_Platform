"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { registerUser, loginUser } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { showSuccess, showError } from "@/shared/utils/toast";
import api from "@/shared/lib/api";

// ================= REGISTER =================
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,

    onSuccess: (res: any) => {
      console.log("✅ REGISTER SUCCESS", res);
      showSuccess(res?.message || "Account created");
    },

    onError: (err: any) => {
      console.error("❌ REGISTER ERROR", err);
      showError(err?.response?.data?.message || "Register failed");
    },
  });
};

// ================= LOGIN =================
export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (res: any) => {
      console.log("🔥 LOGIN RESPONSE:", res);

      // Adjust based on your backend response structure
      const user = res?.data?.user;

      if (!user) {
        console.error("❌ USER NOT FOUND", res);
        showError("Invalid login response");
        return;
      }

      setAuth(user); // ✅ correct usage

      showSuccess(res?.message || "Login successful");
    },

    onError: (err: any) => {
      console.error("❌ LOGIN ERROR", err);
      showError(err?.response?.data?.message || "Login failed");
    },
  });
};

// ================= CURRENT USER =================
export const useCurrentUser = () => {
  const [loading, setLoading] = useState(true);
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const hasToken = document.cookie.includes("access");

    if (!hasToken) {
      setAuth(null);
      setLoading(false);
      return;
    }

    api
      .get("/auth/me/")
      .then((res) => {
        const user = res?.data?.user;

        if (user) {
          setAuth(user); // ✅ sync store
        } else {
          setAuth(null);
        }
      })
      .catch((err) => {
        console.error("❌ AUTH CHECK ERROR", err);
        setAuth(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setAuth]);

  return { loading };
};
