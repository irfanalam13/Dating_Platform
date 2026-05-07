import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, getUserProfile, updateProfile } from "@/shared/api/profile.api";

// 🔥 My profile
export const useMyProfile = () => {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,

    // ✅ FIXES
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};

// 🔥 Other user
export const useUserProfile = (userId: number) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,

    // ✅ FIXES
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
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