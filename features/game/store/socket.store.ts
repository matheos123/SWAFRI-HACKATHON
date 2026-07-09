import { create } from "zustand";

export type MatchmakingStatus =
  | "idle"
  | "queued"
  | "matched"
  | "in_game"
  | "finished";

export interface MatchmakingData {
  roomId: string;
  matchId: string;
  isRanked: boolean;
  opponent: {
    userId: string;
    username: string;
  };
}

interface SocketState {
  isConnected: boolean;
  matchmakingStatus: MatchmakingStatus;
  queuePosition: number | null;
  matchData: MatchmakingData | null;

  // Actions
  setConnected: (connected: boolean) => void;
  setMatchmakingStatus: (status: MatchmakingStatus) => void;
  setQueuePosition: (position: number) => void;
  setMatchData: (data: MatchmakingData) => void;
  resetMatchmaking: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: false,
  matchmakingStatus: "idle",
  queuePosition: null,
  matchData: null,

  setConnected: (connected) => set({ isConnected: connected }),
  setMatchmakingStatus: (status) => set({ matchmakingStatus: status }),
  setQueuePosition: (position) => set({ queuePosition: position }),
  setMatchData: (data) => set({ matchData: data }),
  resetMatchmaking: () =>
    set({
      matchmakingStatus: "idle",
      queuePosition: null,
      matchData: null,
    }),
}));
