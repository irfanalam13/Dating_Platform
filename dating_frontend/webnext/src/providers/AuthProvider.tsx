"use client";

import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const publicRoutes = ["/login", "/register"];
  const isPublic = publicRoutes.includes(pathname);

  // 🔥 DO NOT run auth check on login/register
  const { loading } = isPublic ? { loading: false } : useCurrentUser();

  if (!isPublic && loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
