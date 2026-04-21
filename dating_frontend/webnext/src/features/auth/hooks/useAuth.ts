import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { showSuccess, showError } from "@/shared/utils/toast";

// ================= REGISTER =================
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,

    onSuccess: (res: any) => {
      console.log("✅ REGISTER SUCCESS", res);
      showSuccess(res.message || "Account created");
    },

    onError: (err: any) => {
      console.error("❌ REGISTER ERROR", err);
      showError(err.response?.data?.message || "Register failed");
    },
  });
};

// ================= LOGIN =================
export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (res: any) => {
      console.log("🔥 LOGIN SUCCESS FULL RESPONSE:", res);

      const user =
        res?.data?.data?.user ||
        res?.data?.user ||
        res?.user;

      if (!user) {
        console.error("❌ USER NOT FOUND", res);
        return;
      }

      setAuth(user, null);

      showSuccess(res.message || "Login successful");
    },

    onError: (err: any) => {
      console.error("❌ LOGIN ERROR", err);
      showError(err.response?.data?.message || "Login failed");
    },
  });
};