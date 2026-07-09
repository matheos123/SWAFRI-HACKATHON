import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  registerUser,
  loginUser,
  fetchProfile,
  RegisterPayload,
  LoginPayload,
  AuthUser,
} from "../api/auth.api";

//State shape

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  loadProfile: () => Promise<void>;
  clearError: () => void;
  logout: () => void;
}

//Store

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await registerUser(payload);
          set({ user: response.data.user, isLoading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Registration failed",
            isLoading: false,
          });
        }
      },

      login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginUser(payload);
          set({ user: response.data.user, isLoading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Login failed",
            isLoading: false,
          });
        }
      },

      loadProfile: async () => {
        try {
          const user = await fetchProfile();
          set({ user });
        } catch {
          // Session expired or not logged in — clear user silently
          set({ user: null });
        }
      },

      clearError: () => set({ error: null }),

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("rps_token");
        }
        set({ user: null, error: null });
      },
    }),
    {
      name: "rps_auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
