"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Match, Badge, LeaderboardEntry } from "@/shared/types";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { initialBadges, initialMatches, leaderboardData } from "@/constants";

// ─── Helpers 

function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const item = localStorage.getItem(key);
  if (!item) return fallback;
  try {
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

// ─── Context shape 

interface AppStateContextValue {
  // UI navigation state
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Game data (mock until backend endpoints are added)
  badges: Badge[];
  matches: Match[];
  leaderboard: LeaderboardEntry[];

  // Modal state
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isTxModalOpen: boolean;
  setIsTxModalOpen: (open: boolean) => void;
  selectedTxMatch: Match | null;

  // Matchmaking
  isQueueActive: boolean;
  setIsQueueActive: (active: boolean) => void;

  // Handlers
  handleOpenTxDetail: (match: Match) => void;
  handleTriggerFindMatch: () => void;
  handleConnectWallet: (address: string) => void;
  handleDisconnectWallet: () => void;
  handleLogout: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

// ─── Provider 

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Mock game data — will be replaced when match/badge/leaderboard endpoints are integrated
  const [badges] = useState<Badge[]>(() =>
    getStorageItem("rps_arena_badges", initialBadges),
  );
  const [matches, setMatches] = useState<Match[]>(() =>
    getStorageItem("rps_arena_matches", initialMatches),
  );
  const [leaderboard] = useState<LeaderboardEntry[]>(() =>
    getStorageItem("rps_arena_leaderboard", leaderboardData),
  );

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedTxMatch, setSelectedTxMatch] = useState<Match | null>(null);
  const [isQueueActive, setIsQueueActive] = useState(false);

  // Persist matches locally until backend match history is integrated
  useEffect(() => {
    localStorage.setItem("rps_arena_matches", JSON.stringify(matches));
  }, [matches]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleOpenTxDetail = (match: Match) => {
    setSelectedTxMatch(match);
    setIsTxModalOpen(true);
  };

  const handleTriggerFindMatch = () => {
    setIsQueueActive(true);
  };

  // Wallet handlers — will call backend wallet endpoints when available
  const handleConnectWallet = (address: string) => {
    // TODO: call PATCH /auth/wallet endpoint when available
    console.log("Wallet connect:", address);
  };

  const handleDisconnectWallet = () => {
    // TODO: call wallet disconnect endpoint when available
    console.log("Wallet disconnect");
  };

  const handleLogout = () => {
    useAuthStore
      .getState()
      .logout()
      .finally(() => {
        window.location.href = "/login";
      });
  };

  return (
    <AppStateContext.Provider
      value={{
        mobileSidebarOpen,
        setMobileSidebarOpen,
        badges,
        matches,
        leaderboard,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isTxModalOpen,
        setIsTxModalOpen,
        selectedTxMatch,
        isQueueActive,
        setIsQueueActive,
        handleOpenTxDetail,
        handleTriggerFindMatch,
        handleConnectWallet,
        handleDisconnectWallet,
        handleLogout,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside <AppStateProvider>");
  }
  return ctx;
}
