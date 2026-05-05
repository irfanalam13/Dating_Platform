"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ================= TYPES =================
export type User = {
  id: number;
  username: string;
  full_name: string;
};

type AuthState = {
  user: User | null;

  // actions
  setAuth: (user: User | null) => void;
  logout: () => void;
};

// ================= STORE =================
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setAuth: (user) => {
        set({ user });
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);