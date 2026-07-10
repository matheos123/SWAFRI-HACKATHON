"use client";
import LeaderboardView from "@/features/leaderboard/LeaderboardView";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboardUsers } from "@/features/friends/api/friends.api";
import { Loader2 } from "lucide-react";
import { LeaderboardEntry } from "@/shared/types";

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const { data: users, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => getLeaderboardUsers(50),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const entries: LeaderboardEntry[] = (users ?? []).map((u, i) => ({
    rank: i + 1,
    username: u.username,
    level: Math.floor(u.points / 1000) + 1,
    score: u.points,
    winRate: u.totalMatches > 0 ? `${Math.round((u.wins / u.totalMatches) * 100)}%` : "0%",
    status: u.userId === user?.id ? "online" : "offline",
    badgeType: i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "none",
  }));

  return (
    <LeaderboardView
      entries={entries}
      currentUsername={user?.username ?? ""}
    />
  );
}
