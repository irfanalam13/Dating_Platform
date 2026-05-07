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





// "use client";

// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "@/shared/lib/query-client";
// import { Toaster } from "react-hot-toast";
// import AuthProvider from "@/providers/AuthProvider";

// export default function Providers({ children }: any) {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         {children}
//       </AuthProvider>
//       <Toaster position="top-right" />
//     </QueryClientProvider>
//   );
// }


"use client";

import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useMemo } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const publicRoutes = ["/login", "/register"];
  const isPublic = publicRoutes.includes(pathname);

  // ALWAYS call hook
  const auth = useCurrentUser();

  // ✅ MEMOIZE (prevents unnecessary rerenders)
  const value = useMemo(() => auth, [auth.user, auth.loading]);

  if (!isPublic && value.loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}