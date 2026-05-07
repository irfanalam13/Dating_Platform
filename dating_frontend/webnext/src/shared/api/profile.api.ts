import type { DiscoverResponse, MatchResponse, Profile } from "@/shared/types/profile.types";
import api from "./client";

export const getMyProfile = async (): Promise<Profile> => {
  const res = await api.get("/profile/me/");
  return res.data;
};

export const getUserProfile = async (userId: number) => {
  const res = await api.get(`/profile/${userId}/`);
  return res.data;
};

/**
 * UPDATED: Removed manual Content-Type header.
 * Axios will automatically set the correct Content-Type 
 * with the necessary 'boundary' string for FormData.
 */
// profile.api.ts
export const updateProfile = (formData: FormData) => {
  return api.patch("/profile/me/", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // ✅ overrides the instance default
    },
  });
};

export const getDiscoverProfiles = async (): Promise<DiscoverResponse> => {
  const res = await api.get("/matcher/recommendations/");
  return res.data;
};

export const sendInterest = async (
  profileId: number,
  action: "like" | "pass"
): Promise<MatchResponse> => {
  const res = await api.post(`/matcher/send/${profileId}/`, { action });
  return res.data;
};