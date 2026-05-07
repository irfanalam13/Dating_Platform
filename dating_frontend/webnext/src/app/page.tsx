"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function Page() {
  const router = useRouter();
  const { loading, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (loading) return;
    router.replace(isAuthenticated ? "/home" : "/login");
  }, [loading, isAuthenticated, router]);

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#FFF8F1] text-sm text-[#746767]">
      Opening your app...
    </main>
  );
}
