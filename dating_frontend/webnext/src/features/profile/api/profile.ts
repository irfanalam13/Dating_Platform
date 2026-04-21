import api from "@/shared/lib/api";
import { Profile } from "../types/profile";

export const getProfile = async (): Promise<Profile> => {
  const res = await api.get("/profile/");
  return res.data;
};

export const updateProfile = async (data: Partial<Profile>) => {
  const res = await api.put("/profile/update/", data);
  return res.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/profile/upload-image/", formData);
  return res.data;
};
