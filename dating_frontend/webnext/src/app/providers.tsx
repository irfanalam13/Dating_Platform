// "use client";

// import { usePathname } from "next/navigation";
// import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
// import { useMemo } from "react";

// export default function AuthProvider({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();

//   const publicRoutes = ["/login", "/register"];
//   const isPublic = publicRoutes.includes(pathname);

//   // ALWAYS call hook
//   const auth = useCurrentUser();

//   // ✅ MEMOIZE (prevents unnecessary rerenders)
//   const value = useMemo(() => auth, [auth.user, auth.loading]);

//   if (!isPublic && value.loading) {
//     return <div>Loading...</div>;
//   }

//   return <>{children}</>;
// }

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import type { User } from "@/shared/types/auth.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useCurrentUser();

  const publicRoutes = ["/login", "/register"];
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  const authValue = useMemo(
    () => ({
      user: auth?.user ?? null,
      loading: auth?.loading ?? false,
    }),
    [auth?.user, auth?.loading]
  );

  if (!isPublic && authValue.loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FFF8F1]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#7A2432]" />
        <span className="ml-3 font-medium text-[#746767]">Loading...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Use this instead of useCurrentUser in any component that just needs user/loading
export const useAuth = () => useContext(AuthContext);