import api from "@/shared/lib/api";

// ✅ Get my profile
export const getMyProfile = async () => {
  const res = await api.get("/profiles/me/");
  return res.data;
};

// ✅ Get other user profile
export const getUserProfile = async (userId: number) => {
  const res = await api.get(`/profiles/${userId}/`);
  return res.data;
};


// ✅ Update profile
export const updateProfile = async (data: FormData) => {
  const res = await api.patch("/profiles/me/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};