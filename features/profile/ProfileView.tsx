"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Award,
  Zap,
  Droplet,
  Flame,
  Crown,
  Eye,
  Layers,
  TrendingUp,
  Calendar,
  Swords,
} from "lucide-react";
import { PlayerProfile, Badge, Match } from "@/shared/types";

interface ProfileViewProps {
  profile: PlayerProfile;
  badges: Badge[];
  matches: Match[];
  onOpenTxDetail: (match: Match) => void;
  onOpenWallet: () => void;
}

export default function ProfileView({
  profile,
  badges,
  matches,
  onOpenTxDetail,
  onOpenWallet,
}: ProfileViewProps) {
  const [historyFilter, setHistoryFilter] = useState<"ALL" | "RANKED">("ALL");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(3);


  // Filter history
  const filteredMatches = matches; // All mock matches are tournament-ranked anyway

  // Handle Load More History
  const handleLoadMoreHistory = () => {
    if (visibleHistoryCount >= filteredMatches.length) {
      setVisibleHistoryCount(3); // Reset to collapse
    } else {
      setVisibleHistoryCount(filteredMatches.length); // Load all
    }
  };


  return (
    <div id="profile-container" className="space-y-6">
      {/* 1. HERO SECTION CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0C1220]/80 p-5 sm:p-7 shadow-xl"
      >
        {/* Subtle grid line backdrop background */}
        <div className="absolute inset-0 opacity-[0.03] bg-grid-white pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Avatar and Info Block */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 sm:gap-6 text-center sm:text-left">
            {/* Holographic Avatar Frame */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-900/60 p-1 shadow-[0_0_20px_rgba(6,182,212,0.15)] group">
                <img
                  src="avatar.png"
                  alt={profile.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* LVL Tag Badge */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-3 py-0.5 rounded-full bg-cyan-400 border border-[#0C1220] shadow-[0_0_12px_rgba(34,211,238,0.6)] text-[9px] font-mono font-black text-[#070A12] uppercase tracking-wider select-none">
                LVL {profile.level}
              </div>
            </div>

            {/* Title / Identity Metadata */}
            <div className="mt-3 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-wide uppercase">
                  {profile.username}
                </h2>
                {profile.verified && (
                  <span className="inline-flex items-center gap-1 self-center px-2.5 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-[10px] font-semibold uppercase tracking-wider select-none">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    On-Chain Verified
                  </span>
                )}
              </div>
              <p className="text-sm font-sans text-gray-400 font-medium mt-1">
                {profile.rank} <span className="text-gray-600 px-1">•</span>{" "}
                <span className="text-indigo-400/90 font-semibold">
                  {profile.title}
                </span>
              </p>

              {/* Reputation Indicator nested box */}
              <div className="mt-4 inline-flex flex-col bg-[#111A2E]/55 border border-slate-800 rounded-xl px-4 py-2.5 text-left min-w-[200px]">
                <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase font-bold">
                  Reputation
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold font-sans text-white">
                    {profile.reputation}
                  </span>
                  <span className="text-xs text-gray-500">
                    / {profile.reputationMax}
                  </span>
                </div>
                {/* Reputation Micro Progress bar */}
                <div className="w-full bg-gray-900 rounded-full h-1 mt-2 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-1 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                    style={{
                      width: `${(profile.reputation / profile.reputationMax) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Wallet Info panel */}
          <div className="bg-[#101726]/40 border border-gray-800/70 rounded-2xl p-4 min-w-[220px] shrink-0 self-stretch md:self-auto flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800/40 mb-3">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                Web3 Nodes
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                ● ACTIVE
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Address</span>
                <span className="font-mono text-white text-right">
                  {profile.walletConnected
                    ? profile.walletAddress
                    : "Disconnected"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Staked Yield</span>
                <span className="text-cyan-400 font-semibold text-right">
                  {profile.walletConnected ? "12.4% APY" : "0.0%"}
                </span>
              </div>
            </div>
            {!profile.walletConnected && (
              <button
                onClick={onOpenWallet}
                className="w-full mt-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 text-[10px] font-bold tracking-widest uppercase hover:bg-cyan-500/10 transition-colors"
              >
                Sync Wallet
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. STATS GRID (4 items) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Matches */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0C1220]/60 p-4 shadow-md group border-t-2 border-t-slate-500"
        >
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">
            Total Matches
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-sans mt-1.5 tracking-wide select-none">
            {profile.totalMatches.toLocaleString()}
          </h3>
          <div className="absolute right-3.5 bottom-3 text-slate-700/60 text-2xl group-hover:scale-110 transition-transform">
            <Swords className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Wins */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-xl border border-cyan-950 bg-[#0C1220]/60 p-4 shadow-md group border-t-2 border-t-cyan-500/80 shadow-cyan-500/5"
        >
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
            Wins
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-cyan-300 font-sans mt-1.5 tracking-wide select-none">
            {profile.wins.toLocaleString()}
          </h3>
          <div className="absolute right-3.5 bottom-3 text-cyan-500/20 text-2xl group-hover:scale-110 transition-transform">
            <Award className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Losses */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-xl border border-rose-950 bg-[#0C1220]/60 p-4 shadow-md group border-t-2 border-t-rose-500/80 shadow-rose-500/5"
        >
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider font-bold">
            Losses
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-rose-300 font-sans mt-1.5 tracking-wide select-none">
            {profile.losses.toLocaleString()}
          </h3>
          <div className="absolute right-3.5 bottom-3 text-rose-500/20 text-2xl group-hover:scale-110 transition-transform">
            <Calendar className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Win Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative overflow-hidden rounded-xl border border-purple-950 bg-[#0C1220]/60 p-4 shadow-md group border-t-2 border-t-purple-500/80 shadow-purple-500/5"
        >
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">
            Win Rate
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-purple-300 font-sans mt-1.5 tracking-wide select-none">
            {profile.winRate}%
          </h3>
          <div className="absolute right-3.5 bottom-3 text-purple-500/20 text-2xl group-hover:scale-110 transition-transform">
            <TrendingUp className="w-8 h-8" />
          </div>
        </motion.div>
      </div>

      {/* 4. RECENT MATCH HISTORY LOGS */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-800/40">
          <h3 className="text-base font-bold font-sans tracking-wider text-white uppercase">
            Recent Match History
          </h3>

          {/* Filters ALL vs RANKED */}
          <div className="flex bg-[#111A2E] p-1 rounded-lg border border-gray-800 select-none">
            <button
              onClick={() => setHistoryFilter("ALL")}
              className={`px-3 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-wider transition-colors ${
                historyFilter === "ALL"
                  ? "bg-[#1D2B4D] text-white shadow"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setHistoryFilter("RANKED")}
              className={`px-3 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-wider transition-colors ${
                historyFilter === "RANKED"
                  ? "bg-[#1D2B4D] text-white shadow"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Ranked
            </button>
          </div>
        </div>

        {/* Tabular Match list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-gray-900/60 pb-3 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Opponent</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Reward</th>
                <th className="py-3 px-4 text-right">Tx ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/40 text-xs text-gray-300">
              {filteredMatches.slice(0, visibleHistoryCount).map((match) => {
                const isVictory = match.status === "VICTORY";
                return (
                  <tr
                    key={match.id}
                    className="hover:bg-[#101726]/30 transition-colors group"
                  >
                    {/* Status Column with colored vertical side edge bar */}
                    <td className="py-4 px-4 font-bold tracking-widest relative">
                      <div
                        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r ${
                          isVictory
                            ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                            : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                        }`}
                      />
                      <span
                        className={
                          isVictory
                            ? "text-cyan-400 font-sans"
                            : "text-rose-500 font-sans"
                        }
                      >
                        {match.status}
                      </span>
                    </td>

                    {/* Opponent Identity details */}
                    <td className="py-4 px-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-linear-to-tr from-gray-800 to-slate-800 flex items-center justify-center text-[10px] font-mono text-gray-400 uppercase select-none shrink-0">
                          {match.opponent[0]}
                        </span>
                        <div>
                          <span>{match.opponent}</span>
                          <span className="text-[9px] text-gray-500 font-mono ml-1.5">
                            (LVL {match.opponentLevel})
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Score column */}
                    <td className="py-4 px-4 font-bold font-sans text-gray-200">
                      {match.score}
                    </td>

                    {/* Reward details */}
                    <td className="py-4 px-4 font-medium">
                      <div className="flex flex-col">
                        <span
                          className={
                            isVictory ? "text-emerald-400" : "text-rose-400"
                          }
                        >
                          {isVictory ? "+" : ""}
                          {match.rewardRP} RP
                        </span>
                        <span className="text-[10px] text-cyan-300 font-mono mt-0.5">
                          {isVictory ? `+${match.rewardRPS} $RPS` : "0 $RPS"}
                        </span>
                      </div>
                    </td>

                    {/* Clickable TX Link column */}
                    <td className="py-4 px-4 text-right font-mono text-gray-500 group-hover:text-cyan-400 transition-colors">
                      <button
                        onClick={() => onOpenTxDetail(match)}
                        className="inline-flex items-center gap-1.5 hover:underline cursor-pointer select-none"
                        title="View raw on-chain transaction logs"
                      >
                        <span className="text-gray-400 group-hover:text-cyan-300 font-mono">
                          {match.txId}
                        </span>
                        <Eye className="w-3.5 h-3.5 text-gray-600 group-hover:text-cyan-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Load More/Collapse list CTA */}
        <div className="mt-5 text-center">
          <button
            onClick={handleLoadMoreHistory}
            className="text-[10px] font-mono text-gray-400 hover:text-white uppercase tracking-widest font-bold border-b border-transparent hover:border-white pb-0.5 transition-all select-none cursor-pointer"
          >
            {visibleHistoryCount >= filteredMatches.length
              ? "COLLAPSE HISTORY"
              : "LOAD FULL HISTORY"}
          </button>
        </div>
      </div>
    </div>
  );
}
