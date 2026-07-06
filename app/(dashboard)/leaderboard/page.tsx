"use client";
import LeaderboardView from "@/features/leaderboard/LeaderboardView";
import { useAppState } from "@/shared/context/AppStateContext";

export default function LeaderboardPage() {
  const { leaderboard, profile } = useAppState();

  return (
    <LeaderboardView
      entries={leaderboard ?? []}
      currentUsername={profile.username}
    />
  );
}
