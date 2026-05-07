// // src/features/auth/hooks/useCurrentUser.ts
// "use client";

// import { useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getMe } from "@/shared/api/auth.api";
// import { useAuthStore } from "../store/auth.store";

// export interface User {
//   id: string | number;
//   email: string;
//   name?: string;
//   full_name?: string;
//   image?: string;
//   profile_image?: string;
//   location?: string;
//   age?: number;
//   bio?: string;
//   about?: string;
//   interests?: string[];
//   matches?: number;
//   likes_received?: number;
//   photos_count?: number;
//   photos?: string[];
//   settings?: unknown;
// }

// export function useCurrentUser() {
//   const { user: storeUser, setAuth } = useAuthStore();

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["authUser"],
//     queryFn: async () => {
//       try {
//         const res = await getMe();
//         return res;
//       } catch (err: unknown) {
//         const status = typeof err === "object" && err !== null && "response" in err
//           ? (err as { response?: { status?: number } }).response?.status
//           : undefined;
//         if (status === 401) {
//           return null; // Graceful 401 handling
//         }
//         throw err;
//       }
//     },
//     refetchOnWindowFocus: false,
//     refetchOnMount: false, // 🔒 Stops the query from refetching on remount
//     refetchOnReconnect: false,
//     staleTime: 1000 * 60 * 5, // 5 minutes cache
//     retry: false, // Prevents endless API retries
//   });

//   useEffect(() => {
//     const currentUser = data?.data || data?.user || data;

//     if (currentUser) {
//       // 🔒 Only update Zustand store if the user object has changed
//       if (JSON.stringify(storeUser) !== JSON.stringify(currentUser)) {
//         setAuth(currentUser);
//       }
//     } else if (!isLoading) {
//       // 🔒 Only update Zustand to null if it's not already null
//       if (storeUser !== null) {
//         setAuth(null);
//       }
//     }
//   }, [data, isLoading, storeUser, setAuth]);

//   return {
//     user: (data?.data || data?.user || data) as User | null,
//     loading: isLoading,
//     isAuthenticated: !!(data?.data || data?.user || data),
//     error,
//     refetch,
//   };
// }



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