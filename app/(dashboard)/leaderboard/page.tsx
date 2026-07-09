"use client";
import LeaderboardView from "@/features/leaderboard/LeaderboardView";
import { useAppState } from "@/shared/context/AppStateContext";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function LeaderboardPage() {
  const { leaderboard } = useAppState();
  const { user } = useAuthStore();

  return (
    <LeaderboardView
      entries={leaderboard ?? []}
      currentUsername={user?.username ?? ""}
    />
  );
}
