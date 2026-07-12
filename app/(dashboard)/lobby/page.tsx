"use client";

import { useEffect } from "react";
import { Eye, Loader2, Swords, Radio } from "lucide-react";
import MatchArena from "@/features/lobby/components/MatchArena";
// import PlayerStatsPanel from "@/features/leaderboard/PlayerStatusPanel";
import LiveChatPanel from "@/features/leaderboard/LiveChatPanel";
import { useSpectator } from "@/features/game/hooks/useSpectator";
import { useSquadStore } from "@/features/friends/store/squad.store";

function SpectatorPanel() {
  const { rooms, isLoading, fetchRooms, joinAsSpectator } = useSpectator();
  const { squad, squadMembers } = useSquadStore();
  const squadMemberIds = new Set(squadMembers.map((member) => member.id));
  const squadRooms = squad
    ? rooms.filter(
        (room) =>
          squadMemberIds.has(room.player1.userId) ||
          squadMemberIds.has(room.player2.userId),
      )
    : [];

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]); 

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d111a]/80 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase font-mono">
            Live Battles
          </h3>
        </div>
        <button
          onClick={fetchRooms}
          className="text-[9px] font-mono text-slate-500 hover:text-slate-300 uppercase tracking-wider transition-colors"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
        </div>
      ) : !squad ? (
        <p className="text-[10px] text-slate-600 font-mono text-center py-4">
          Join a squad to watch squad member battles.
        </p>
      ) : squadRooms.length === 0 ? (
        <p className="text-[10px] text-slate-600 font-mono text-center py-4">
          No squad members are battling right now.
        </p>
      ) : (
        <div className="space-y-2">
          {squadRooms.map((room) => (
            <div
              key={room.roomId}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-800/60 bg-[#0a0d14]/60"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
                  <span className="truncate font-bold">
                    {room.player1.username}
                  </span>
                  <Swords className="w-3 h-3 text-slate-600 shrink-0" />
                  <span className="truncate font-bold">
                    {room.player2.username}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-slate-500 font-mono">
                    Round {room.round}
                  </span>
                  {room.isRanked && (
                    <span className="text-[9px] text-cyan-400 font-mono">
                      ⚡ Ranked
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => joinAsSpectator(room.roomId)}
                className="ml-2 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 text-indigo-400 text-[9px] font-bold uppercase tracking-wider hover:bg-indigo-950/20 transition-colors shrink-0"
              >
                <Eye className="w-3 h-3" />
                Watch
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LobbyPage() {
  return (
    <div className="w-full grid grid-cols-1 gap-4 items-start lg:gap-5 2xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
      {/* LEFT: Match arena + history/leaderboard panels */}
      <div className="space-y-4 lg:space-y-5">
        <MatchArena />
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MatchHistory />
          <LeaderboardPanel />
        </div> */}
      </div>

      {/* RIGHT: Stats + spectator + chat */}
      <div className="space-y-4 lg:space-y-5 flex flex-col">
        {/* <PlayerStatsPanel /> */}
        <SpectatorPanel />
        <LiveChatPanel />
      </div>
    </div>
  );
}
