"use client";
import LeaderboardView from "@/features/leaderboard/LeaderboardView";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/features/leaderboard/api/leaderboard.api";
import { Loader2 } from "lucide-react";
import { LeaderboardEntry } from "@/shared/types";

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const { data: users, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => getLeaderboard(50),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const entries: LeaderboardEntry[] = (users ?? []).map((u) => ({
    rank: u.rank,
    username: u.username,
    level: Math.floor(u.points / 1000) + 1,
    score: u.points,
    winRate: `${u.winRate}%`,
    status: u.userId === user?.id ? "online" : "offline",
    badgeType:
      u.rank === 1
        ? "gold"
        : u.rank === 2
          ? "silver"
          : u.rank === 3
            ? "bronze"
            : "none",
  }));

  return (
    <LeaderboardView
      entries={entries}
      currentUsername={user?.username ?? ""}
    />
  );
}
