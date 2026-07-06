"use client"
import { motion } from "motion/react";
import { Trophy, Shield, User, Award, Circle } from "lucide-react";
import { LeaderboardEntry } from "@/shared/types";

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentUsername: string;
}

export default function LeaderboardView({
  entries=[],
  currentUsername,
}: LeaderboardViewProps) {
  return (
    <div id="leaderboard-view-container" className="space-y-6">
      {/* Competitive Season Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-indigo-500/10 bg-linear-to-r from-indigo-950/20 to-slate-950/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-black text-white font-sans tracking-widest uppercase">
              Season 4: Arena Champions
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Top 3 commanders receive exclusive physical gold-backed NFT
              achievements & staking pools.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#141B2D] border border-gray-800 text-xs font-mono font-bold text-indigo-300">
          <span>ENDS: 24D 18H 32M</span>
        </div>
      </motion.div>

      {/* Leaderboard Table Container */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-5 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800/40 mb-5">
          <h3 className="text-sm font-black text-white font-sans tracking-widest uppercase">
            Global Commander Rankings
          </h3>
          <span className="text-[10px] font-mono text-gray-500 tracking-wider font-bold uppercase">
            POLY_SCAN SECURED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-162.5">
            <thead>
              <tr className="border-b border-gray-900 pb-3 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Commander Node</th>
                <th className="py-3 px-4">Battle Rating (RP)</th>
                <th className="py-3 px-4">Win Rate</th>
                <th className="py-3 px-4 text-right">Node State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/40 text-xs text-gray-300">
              {entries.map((entry) => {
                const isCurrentUser = entry.username === currentUsername;

                // Rank Badges
                const renderRankBadge = (rank: number, type: string) => {
                  if (rank === 1)
                    return (
                      <span className="text-yellow-400 filter drop-shadow-[0_0_4px_rgba(234,179,8,0.3)]">
                        👑 1st
                      </span>
                    );
                  if (rank === 2)
                    return <span className="text-gray-300">🥈 2nd</span>;
                  if (rank === 3)
                    return <span className="text-amber-600">🥉 3rd</span>;
                  return (
                    <span className="font-mono text-gray-500">{rank}th</span>
                  );
                };

                return (
                  <tr
                    key={entry.rank}
                    className={`transition-colors duration-150 ${
                      isCurrentUser
                        ? "bg-cyan-950/20 hover:bg-cyan-950/35 border-l-2 border-cyan-400"
                        : "hover:bg-slate-900/20"
                    }`}
                  >
                    {/* Rank cell */}
                    <td className="py-4 px-4 font-bold text-center w-24">
                      {renderRankBadge(entry.rank, entry.badgeType)}
                    </td>

                    {/* Commander user & level info */}
                    <td className="py-4 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold uppercase select-none ${
                            isCurrentUser
                              ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                              : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {entry.username[0]}
                        </div>
                        <div>
                          <span
                            className={
                              isCurrentUser ? "text-cyan-300 font-bold" : ""
                            }
                          >
                            {entry.username}
                          </span>
                          {isCurrentUser && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-[9px] font-mono text-cyan-400 font-bold uppercase">
                              YOU
                            </span>
                          )}
                          <span className="block text-[10px] text-gray-500 font-mono mt-0.5 font-medium">
                            Node Level {entry.level}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Score (RP) */}
                    <td className="py-4 px-4 font-bold font-sans text-white text-sm">
                      {entry.score.toLocaleString()} RP
                    </td>

                    {/* Win Rate */}
                    <td className="py-4 px-4 font-mono text-gray-300 font-medium">
                      {entry.winRate}
                    </td>

                    {/* Status Dot */}
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Circle
                          className={`w-2 h-2 fill-current ${
                            entry.status === "online"
                              ? "text-emerald-400 animate-pulse"
                              : entry.status === "ingame"
                                ? "text-cyan-400 animate-pulse"
                                : "text-gray-600"
                          }`}
                        />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                          {entry.status === "online"
                            ? "Online"
                            : entry.status === "ingame"
                              ? "In Battle"
                              : "Offline"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
