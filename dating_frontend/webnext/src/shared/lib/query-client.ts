// src/shared/lib/react-query.ts

import { QueryClient } from "@tanstack/react-query";

/**
 * Global default config for all queries
 * This prevents:
 * - infinite refetch loops
 * - unnecessary network calls
 * - unstable UI behavior
 */
export const queryConfig = {
  staleTime: 1000 * 60 * 5, // 5 minutes (better for apps like chat/dating)
  gcTime: 1000 * 60 * 30, // 30 minutes cache retention
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false, // prevents double API calls on navigation
  retry: 1,
  retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 5000),
};

/**
 * Single QueryClient instance for the whole app
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: queryConfig,
    mutations: {
      retry: 1,
    },
  },
});