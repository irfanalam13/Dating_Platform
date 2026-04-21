import { create } from "zustand";

type User = {
  id: number;
  username: string;
  full_name: string;
};

type AuthState = {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setAuth: (user) => {
    set({ user });
  },

  logout: () => {
    set({ user: null });
  },
}));