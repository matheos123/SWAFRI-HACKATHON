"use client";
import MatchArena from "@/features/lobby/components/MatchArena";
import MatchHistory from "@/features/history/MatchHistory";
import LeaderboardPanel from "@/features/leaderboard/components/LeaderboardPanel";
import PlayerStatsPanel from "@/features/leaderboard/PlayerStatusPanel";
import LiveChatPanel from "@/features/leaderboard/LiveChatPanel";

export default function LobbyPage() {
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
      {/* LEFT: Match arena + history/leaderboard panels (3 columns) */}
      <div className="xl:col-span-3 space-y-6">
        <MatchArena />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MatchHistory />
          <LeaderboardPanel />
        </div>
      </div>

      {/* RIGHT: Stats + chat (1 column) */}
      <div className="xl:col-span-1 space-y-6 h-full flex flex-col">
        <PlayerStatsPanel />
        <LiveChatPanel />
      </div>
    </div>
  );
}
