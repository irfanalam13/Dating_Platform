"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function Page() {
  const { loading, isAuthenticated } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated]);

  if (loading) return <div>Loading...</div>;

  return <div>Shree Page ✅</div>;

}

