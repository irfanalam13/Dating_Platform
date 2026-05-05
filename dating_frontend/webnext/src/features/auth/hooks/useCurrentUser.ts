// "use client";

// import { useEffect, useState } from "react";
// import api from "@/shared/lib/api";

// export const useCurrentUser = () => {
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const hasToken = document.cookie.includes("access");

//     if (!hasToken) {
//       setLoading(false);
//       setIsAuthenticated(false);
//       return;
//     }

//     api.get("/auth/me/")
//       .then(() => {
//         setIsAuthenticated(true);
//       })
//       .catch(() => {
//         setIsAuthenticated(false);
//       })
//       .finally(() => {
//         setLoading(false);
//       });

//   }, []);

//   return { loading, isAuthenticated };
// };






import { useEffect, useState } from "react";
import api from "@/shared/lib/api";

export function useCurrentUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // 🔐 1. Initialize CSRF FIRST
        await api.get("/auth/csrf/");

        // 👤 2. Fetch user
        const res = await api.get("/auth/profile/me/");
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user, // ✅ ADD THIS
  };
}