import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Squad, SquadMember } from "@/shared/types";

interface SquadState {
  squad: Squad | null;
  squadMembers: SquadMember[];
  initializeSquad: (name: string, privacy: "Public" | "Encrypted" | "Cloaked") => void;
  disbandSquad: () => void;
  updateSquadName: (name: string) => void;
  updateSquadPrivacy: (privacy: "Public" | "Encrypted" | "Cloaked") => void;
  kickMember: (id: string) => void;
  toggleMute: (id: string) => void;
}

export const useSquadStore = create<SquadState>()(
  persist(
    (set) => ({
      squad: null,
      squadMembers: [],

      initializeSquad: (name, privacy) => {
        set({
          squad: {
            name,
            privacy,
            membersCount: 1,
            status: "ACTIVE",
            maxMembers: 5,
            winRate: "78%",
            winRateTrend: "+4.2%",
            totalOnChainWins: 42,
            globalStanding: "#1,402",
          },
          squadMembers: [
            {
              id: "leader",
              username: "Commander",
              verified: true,
              ping: "24ms",
              statusText: "Ready",
              status: "online",
              rank: "LEGEND",
              role: "LEADER",
              micMuted: false,
            }
          ]
        });
      },

      disbandSquad: () => set({ squad: null, squadMembers: [] }),

      updateSquadName: (name) => set((state) => {
        if (!state.squad) return state;
        return {
          squad: { ...state.squad, name }
        };
      }),

      updateSquadPrivacy: (privacy) => set((state) => {
        if (!state.squad) return state;
        return {
          squad: { ...state.squad, privacy }
        };
      }),

      kickMember: (id) => set((state) => ({
        squadMembers: state.squadMembers.filter((m) => m.id !== id)
      })),

      toggleMute: (id) => set((state) => ({
        squadMembers: state.squadMembers.map((m) =>
          m.id === id ? { ...m, micMuted: !m.micMuted } : m
        )
      }))
    }),
    {
      name: "squad-storage",
    }
  )
);
