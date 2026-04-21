import { create } from "zustand";

interface AuthState {
  access: string | null;
  user: any;

  setAuth: (data: any) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  access: null,
  user: null,

  setAuth: (data) =>
    set({
      access: data.access,
    }),

  logout: () =>
    set({
      access: null,
      user: null,
    }),
}));