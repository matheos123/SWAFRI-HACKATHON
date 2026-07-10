import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchProfile,
  RegisterPayload,
  LoginPayload,
  AuthUser,
} from "../api/auth.api";
import { useSquadStore } from "@/features/friends/store/squad.store";

//State shape

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  loadProfile: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  clearError: () => void;
  logout: () => Promise<void>;
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
          useSquadStore.getState().disbandSquad();
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
          useSquadStore.getState().disbandSquad();
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
          set({ user: null });
        }
      },

      setUser: (user) => set({ user }),

      clearError: () => set({ error: null }),

      logout: async () => {
        try {
          await logoutUser(); // clears httpOnly cookie on server
        } catch {
          // ignore — clear local state regardless
        }
        useSquadStore.getState().disbandSquad();
        set({ user: null, error: null });
      },
    }),
    {
      name: "rps_auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
