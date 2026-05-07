// // "use client";

// // import { usePathname } from "next/navigation";
// // import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

// // export default function AuthProvider({ children }: { children: React.ReactNode }) {
// //   const pathname = usePathname();

// //   const publicRoutes = ["/login", "/register"];
// //   const isPublic = publicRoutes.includes(pathname);

// //   // 🔥 DO NOT run auth check on login/register
// //   const { loading } = isPublic ? { loading: false } : useCurrentUser();

// //   if (!isPublic && loading) {
// //     return <div>Loading...</div>;
// //   }

// //   return <>{children}</>;
// // }


// "use client";

// import { usePathname } from "next/navigation";
// import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

// export default function AuthProvider({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();

//   const publicRoutes = ["/login", "/register"];
//   const isPublic =
//   pathname.startsWith("/login") ||
//   pathname.startsWith("/register");
//   // ✅ ALWAYS call hook
//   const auth = useCurrentUser();

//   // 🔥 ignore loading for public routes
//   const loading = isPublic ? false : auth.loading;

//   if (!isPublic && loading) {
//     return <div>Loading...</div>;
//   }

//   return <>{children}</>;
// }



"use client";

import React, { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useCurrentUser, User } from "@/features/auth/hooks/useCurrentUser";

// 1. Define the shape of our Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 3. Call our hook (which has the retry: false logic)
  const auth = useCurrentUser();

  // 4. Identify public routes to prevent loading screens on Login/Register
  const publicRoutes = ["/login", "/register"];
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));

  // 5. Memoize the value to prevent unnecessary re-renders
  const authValue = useMemo(() => ({
    user: auth?.user ?? null,
    loading: auth?.loading ?? false
  }), [auth?.user, auth?.loading]);

  // 6. If we are on a private page and still fetching, show loading
  if (!isPublic && authValue.loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 7. Export a custom hook so other components can use the user easily
export const useAuth = () => useContext(AuthContext);