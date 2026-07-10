"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";

export default function PlayerStatsPanel() {
  const { user } = useAuthStore();

  if (!user) return null;

  const winRate =
    user.totalMatches > 0
      ? ((user.wins / user.totalMatches) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d111a]/80 p-5 shadow-xl space-y-5">
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-xl font-mono font-black text-indigo-300 uppercase">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            user.username[0]
          )}
        </div>
        <div>
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            {user.username}
            {user.walletAddress && (
              <span className="ml-1 text-cyan-400">⚡</span>
            )}
          </h3>
          <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">
            {user.role}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 text-center border-y border-slate-800/40 py-3">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Wins
          </span>
          <span className="text-sm font-mono font-bold text-slate-200">
            {user.wins.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Matches
          </span>
          <span className="text-sm font-mono font-bold text-slate-200">
            {user.totalMatches.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Win Rate
          </span>
          <span className="text-sm font-mono font-bold text-emerald-400">
            {winRate}%
          </span>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Current Streak
          </span>
          <span className="text-sm font-mono font-bold text-amber-400">
            {user.currentStreak} 🔥
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Points
          </span>
          <span className="text-sm font-mono font-bold text-cyan-400">
            {user.points.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
