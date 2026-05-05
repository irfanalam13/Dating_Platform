import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, getUserProfile, updateProfile } from ".././api";

// 🔥 My profile
export const useMyProfile = () => {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });
};

// 🔥 Other user
export const useUserProfile = (userId: number) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
};

// 🔥 Update
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
};