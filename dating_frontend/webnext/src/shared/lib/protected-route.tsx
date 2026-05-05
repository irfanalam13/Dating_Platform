"use client";

import { ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/shared/context/auth-context";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  if (!auth) return null;

  const { user, loading } = auth;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // ⏳ While checking auth
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // 🚫 Not logged in
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
