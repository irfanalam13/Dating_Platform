// "use client";

// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "@/shared/lib/query-client";
// import { Toaster } from "react-hot-toast";

// export default function Providers({ children }: any) {
//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//       <Toaster position="top-right" />
//     </QueryClientProvider>
//   );
// }





"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/providers/AuthProvider";

export default function Providers({ children }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}