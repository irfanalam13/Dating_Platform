import api from "@/shared/lib/api";
import { LoginPayload, RegisterPayload, AuthResponse } from "../types/auth.types";

// 🟢 REGISTER
export const registerUser = async (
  data: RegisterPayload
): Promise<AuthResponse> => {
  const res = await api.post("/auth/register/", data);
  return res.data;
};


// 🟢 LOGIN
export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post("/auth/login/", data, {
    withCredentials: true, // ✅ correct place
  });
  return res.data;
};

// 🔴 LOGOUT
export const logoutUser = async (refresh: string) => {
  const res = await api.post(
    "/auth/logout/",
    { refresh },
    {
      withCredentials: true, // ✅ correct
    }
  );
  return res.data;
};

// 🔐 GET CURRENT USER
export const getMe = async () => {
  const res = await api.get("/auth/me/", {
    withCredentials: true, // 🔥 REQUIRED
  });
  return res.data;
};