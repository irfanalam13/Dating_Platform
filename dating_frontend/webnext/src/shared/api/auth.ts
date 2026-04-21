import { api } from "@/shared/lib/api";

export const registerUser = (data: any) => {
  return api.post("/auth/register/", data);
};

export const loginUser = (data: any) => {
  return api.post("/auth/login/", data);
};

export const getMe = () => {
  return api.get("/auth/me/");
};

export const logoutUser = (refresh: string) => {
  return api.post("/auth/logout/", { refresh });
};