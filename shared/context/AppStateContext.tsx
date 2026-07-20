"use client";

import React, { createContext, useContext, useState } from "react";
import { Match, Badge, LeaderboardEntry } from "@/shared/types";
import { useAuthStore } from "@/features/auth/store/auth.store";

// Context shape

interface AppStateContextValue {
  // UI navigation state
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Game data state (live data managed by features)
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
  handleConnectWallet: () => void;
  handleDisconnectWallet: () => void;
  handleLogout: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

// Provider

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Live game data — features handle their own real API queries via React Query
  const [badges] = useState<Badge[]>([]);
  const [matches] = useState<Match[]>([]);
  const [leaderboard] = useState<LeaderboardEntry[]>([]);

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedTxMatch, setSelectedTxMatch] = useState<Match | null>(null);
  const [isQueueActive, setIsQueueActive] = useState(false);

  // Handlers

  const handleOpenTxDetail = (match: Match) => {
    setSelectedTxMatch(match);
    setIsTxModalOpen(true);
  };

  const handleTriggerFindMatch = () => {
    setIsQueueActive(true);
  };

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleDisconnectWallet = () => {
    setIsWalletModalOpen(true);
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

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside <AppStateProvider>");
  }
  return ctx;
}
