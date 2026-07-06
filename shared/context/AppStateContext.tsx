"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Match, PlayerProfile, Badge, LeaderboardEntry } from "@/shared/types";
import {
  initialProfile,
  initialBadges,
  initialMatches,
  leaderboardData,
} from "@/constants";

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// ─── Context shape ───────────────────────────────────────────────────────────

interface AppStateContextValue {
  // Navigation
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Data
  profile: PlayerProfile;
  badges: Badge[];
  matches: Match[];
  leaderboard: LeaderboardEntry[];

  // Modal state
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isTxModalOpen: boolean;
  setIsTxModalOpen: (open: boolean) => void;
  selectedTxMatch: Match | null;

  // Queue state
  isQueueActive: boolean;
  setIsQueueActive: (active: boolean) => void;

  // Handlers
  handleConnectWallet: (address: string) => void;
  handleDisconnectWallet: () => void;
  handleAddNewMatch: (match: Match) => void;
  handleUpdateProfileStats: (
    rpChange: number,
    rpsChange: number,
    isWin: boolean,
  ) => void;
  handleUpdateProfileNameAndTitle: (name: string, title: string) => void;
  handleOpenTxDetail: (match: Match) => void;
  handleTriggerFindMatch: () => void;
  handleLogout: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [profile, setProfile] = useState<PlayerProfile>(() =>
    getStorageItem("rps_arena_profile", initialProfile),
  );
  const [badges, setBadges] = useState<Badge[]>(() =>
    getStorageItem("rps_arena_badges", initialBadges),
  );
  const [matches, setMatches] = useState<Match[]>(() =>
    getStorageItem("rps_arena_matches", initialMatches),
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    getStorageItem("rps_arena_leaderboard", leaderboardData),
  );

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedTxMatch, setSelectedTxMatch] = useState<Match | null>(null);
  const [isQueueActive, setIsQueueActive] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("rps_arena_profile", JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem("rps_arena_badges", JSON.stringify(badges));
  }, [badges]);
  useEffect(() => {
    localStorage.setItem("rps_arena_matches", JSON.stringify(matches));
  }, [matches]);
  useEffect(() => {
    localStorage.setItem("rps_arena_leaderboard", JSON.stringify(leaderboard));
  }, [leaderboard]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleConnectWallet = (address: string) => {
    setProfile((prev) => ({
      ...prev,
      walletConnected: true,
      walletAddress: address,
      balanceRPS: prev.balanceRPS === 0 ? 150 : prev.balanceRPS,
    }));
  };

  const handleDisconnectWallet = () => {
    setProfile((prev) => ({
      ...prev,
      walletConnected: false,
      walletAddress: null,
    }));
  };

  const handleAddNewMatch = (newMatch: Match) => {
    setMatches((prev) => [newMatch, ...prev]);
  };

  const handleUpdateProfileStats = (
    rpChange: number,
    rpsChange: number,
    isWin: boolean,
  ) => {
    setProfile((prev) => {
      const newWins = isWin ? prev.wins + 1 : prev.wins;
      const newLosses = !isWin && rpChange < 0 ? prev.losses + 1 : prev.losses;
      const newMatches = prev.totalMatches + 1;
      const newWinRate = parseFloat(((newWins / newMatches) * 100).toFixed(1));
      return {
        ...prev,
        totalMatches: newMatches,
        wins: newWins,
        losses: newLosses,
        winRate: newWinRate,
        balanceRPS: Math.max(0, prev.balanceRPS + rpsChange),
        reputation: Math.min(
          prev.reputationMax,
          Math.max(0, prev.reputation + (isWin ? 5 : -3)),
        ),
      };
    });

    setLeaderboard((prev) =>
      prev
        .map((leader) => {
          if (leader.username === profile.username) {
            return {
              ...leader,
              score: Math.max(0, leader.score + rpChange),
              level: profile.level,
              winRate: `${profile.winRate}%`,
            };
          }
          return leader;
        })
        .sort((a, b) => b.score - a.score),
    );
  };

  const handleUpdateProfileNameAndTitle = (name: string, title: string) => {
    setProfile((prev) => ({ ...prev, username: name, title }));
    setLeaderboard((prev) =>
      prev.map((leader) =>
        leader.username === profile.username || leader.username === "Archer:07"
          ? { ...leader, username: name }
          : leader,
      ),
    );
  };

  const handleOpenTxDetail = (match: Match) => {
    setSelectedTxMatch(match);
    setIsTxModalOpen(true);
  };

  // handleTriggerFindMatch is called from Navbar — navigation handled by the Navbar itself via router
  const handleTriggerFindMatch = () => {
    setIsQueueActive(true);
  };

  const handleLogout = () => {
    console.log("Log out clicked");
  };

  return (
    <AppStateContext.Provider
      value={{
        mobileSidebarOpen,
        setMobileSidebarOpen,
        profile,
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
        handleConnectWallet,
        handleDisconnectWallet,
        handleAddNewMatch,
        handleUpdateProfileStats,
        handleUpdateProfileNameAndTitle,
        handleOpenTxDetail,
        handleTriggerFindMatch,
        handleLogout,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside <AppStateProvider>");
  }
  return ctx;
}
