// "use client";

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// // ================= TYPES =================
// export type User = {
//   id: number;
//   username: string;
//   full_name: string;
// };

// type AuthState = {
//   user: User | null;

//   // actions
//   setAuth: (user: User | null) => void;
//   logout: () => void;
// };

// // ================= STORE =================
// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,

//       setAuth: (user) => {
//         set({ user });
//       },

//       logout: () => {
//         set({ user: null });
//       },
//     }),
//     {
//       name: "auth-storage", // localStorage key
//     }
//   )
// );






"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/shared/types/auth.types"; // ✅ import from single source

// ❌ Remove the local User type — use the shared one above

type AuthState = {
  user: User | null;
  setAuth: (user: User | null) => void;
  logout: () => void;
};

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
      name: "auth-storage",
    }
  )
);