"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/shared/api/auth.api";
import { useAuthStore } from "../store/auth.store";

export function useCurrentUser() {
  const { user: storeUser, setAuth } = useAuthStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await getMe();
        return res?.data || res?.user || res;
      } catch (err) {
        return null; // Return null on error to stop the loop
      }
    },
    // 🛑 STOP THE LOOP SETTINGS
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity, 
  });

  // Sync with Zustand Store
  useEffect(() => {
    const fetchedUser = data;
    if (fetchedUser) {
      if (JSON.stringify(storeUser) !== JSON.stringify(fetchedUser)) {
        setAuth(fetchedUser);
      }
    } else if (!isLoading && storeUser !== null) {
      setAuth(null);
    }
  }, [data, isLoading, storeUser, setAuth]);

  // 🛑 THIS IS WHAT FIXES YOUR TYPEERROR
  return {
    user: storeUser,
    loading: isLoading,
    isAuthenticated: !!storeUser,
    error,
    refetch,
  };
}