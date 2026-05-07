"use client";

import { createContext, useEffect, useState } from "react";
import api from "@/shared/api/client";

type User = {
  id: number;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load user (used everywhere)
  const fetchUser = async () => {
    try {
      const res = await api.get("/profile/me/");
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Login trigger (after login API call)
  const login = async () => {
    await fetchUser();
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout/");
    } catch {
      // ignore
    }
    setUser(null);
  };

  // 🧠 Initial load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
