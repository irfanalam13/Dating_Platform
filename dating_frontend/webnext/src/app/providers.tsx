"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}