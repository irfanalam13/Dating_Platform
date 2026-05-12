import api from "./client";
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
  const res = await api.post("/auth/login/", data);
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
// export const getMe = async () => {
//   const res = await api.get("/auth/me/", {
//     withCredentials: true, // 🔥 REQUIRED
//   });
//   return res.data;
// };



// 🔐 GET CURRENT USER — bypasses interceptor to avoid refresh loop
export const getMe = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/me/`,
    {
      method: "GET",
      credentials: "include", // still sends cookies
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) return null; // 401 = not logged in, just return null cleanly

  return res.json();
};