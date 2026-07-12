"use client"
import Link from "next/link";
import { Circle } from "lucide-react";
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

        <div className="space-y-3 sm:hidden">
          {entries.map((entry) => {
            const isCurrentUser = entry.username === currentUsername;
            return (
              <article
                key={entry.rank}
                className={`rounded-xl border p-4 ${
                  isCurrentUser
                    ? "border-cyan-500/30 bg-cyan-950/10"
                    : "border-slate-800 bg-slate-950/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">
                      Rank #{entry.rank}
                    </p>
                    <Link
                      href={entry.userId ? `/users/${entry.userId}` : "#"}
                      className="mt-1 block truncate text-sm font-bold text-white hover:text-cyan-300"
                    >
                      {entry.username}
                    </Link>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Level {entry.level}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                    {entry.winRate}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{entry.score.toLocaleString()} RP</span>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">
                    {entry.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="hidden sm:block overflow-x-hidden">
          <table className="w-full table-fixed text-left border-collapse">
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
                const renderRankBadge = (rank: number) => {
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
                      {renderRankBadge(entry.rank)}
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
                          <Link
                            href={entry.userId ? `/users/${entry.userId}` : "#"}
                            className={
                              `${isCurrentUser ? "text-cyan-300 font-bold" : ""} hover:text-cyan-300 hover:underline`
                            }
                          >
                            {entry.username}
                          </Link>
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
