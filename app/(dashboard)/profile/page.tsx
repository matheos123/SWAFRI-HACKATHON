"use client";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAppState } from "@/shared/context/AppStateContext";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Award,
  TrendingUp,
  Calendar,
  Swords,
  Wallet,
  Zap,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { setIsWalletModalOpen } = useAppState();

  if (!user) return null;

  const winRate =
    user.totalMatches > 0
      ? ((user.wins / user.totalMatches) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0C1220]/80 p-5 sm:p-7 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Avatar + identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-900/60 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-4xl font-black font-mono text-cyan-300 uppercase">
                    {user.username[0]}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-3 py-0.5 rounded-full bg-cyan-400 border border-[#0C1220] shadow-[0_0_12px_rgba(34,211,238,0.6)] text-[9px] font-mono font-black text-[#070A12] uppercase tracking-wider select-none whitespace-nowrap">
                {user.role}
              </div>
            </div>

            <div className="mt-3 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-wide uppercase">
                  {user.username}
                </h2>
                {user.walletAddress && (
                  <span className="inline-flex items-center gap-1 self-center px-2.5 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-[10px] font-semibold uppercase tracking-wider select-none">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    On-Chain Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1 font-mono">
                {user.email}
              </p>

              {/* Points + streak */}
              <div className="mt-4 flex gap-3 flex-wrap">
                <div className="inline-flex flex-col bg-[#111A2E]/55 border border-slate-800 rounded-xl px-4 py-2.5 text-left">
                  <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase font-bold">
                    Points
                  </span>
                  <span className="text-xl font-bold font-sans text-white mt-0.5">
                    {user.points.toLocaleString()}
                  </span>
                </div>
                <div className="inline-flex flex-col bg-[#111A2E]/55 border border-slate-800 rounded-xl px-4 py-2.5 text-left">
                  <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase font-bold">
                    Current Streak
                  </span>
                  <span className="text-xl font-bold font-sans text-amber-400 mt-0.5">
                    {user.currentStreak} 🔥
                  </span>
                </div>
                <div className="inline-flex flex-col bg-[#111A2E]/55 border border-slate-800 rounded-xl px-4 py-2.5 text-left">
                  <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase font-bold">
                    Best Streak
                  </span>
                  <span className="text-xl font-bold font-sans text-purple-300 mt-0.5">
                    {user.longestStreak}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet panel */}
          <div className="bg-[#101726]/40 border border-gray-800/70 rounded-2xl p-4 min-w-[220px] shrink-0 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800/40 mb-3">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                Wallet
              </span>
              <span
                className={`text-[10px] font-mono font-semibold ${user.walletAddress ? "text-emerald-400" : "text-gray-500"}`}
              >
                {user.walletAddress ? "● CONNECTED" : "● DISCONNECTED"}
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Address</span>
                <span className="font-mono text-white text-right">
                  {user.walletAddress
                    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
                    : "—"}
                </span>
              </div>
            </div>
            {!user.walletAddress && (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="w-full mt-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 text-[10px] font-bold tracking-widest uppercase hover:bg-cyan-500/10 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Matches",
            value: user.totalMatches.toLocaleString(),
            icon: Swords,
            color: "slate",
          },
          {
            label: "Wins",
            value: user.wins.toLocaleString(),
            icon: Award,
            color: "cyan",
          },
          {
            label: "Losses",
            value: user.losses.toLocaleString(),
            icon: Calendar,
            color: "rose",
          },
          {
            label: "Win Rate",
            value: `${winRate}%`,
            icon: TrendingUp,
            color: "purple",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-xl border border-${color}-950 bg-[#0C1220]/60 p-4 shadow-md group border-t-2 border-t-${color}-500/80`}
          >
            <span
              className={`text-[10px] font-mono text-${color}-400 uppercase tracking-wider font-bold`}
            >
              {label}
            </span>
            <h3
              className={`text-2xl sm:text-3xl font-black text-${color}-300 font-sans mt-1.5 tracking-wide select-none`}
            >
              {value}
            </h3>
            <div
              className={`absolute right-3.5 bottom-3 text-${color}-500/20 group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-8 h-8" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Account info */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 pb-3 border-b border-gray-800/40">
          Account Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
          {[
            { label: "Email or Wallet Address", value: user.email },
            { label: "Status", value: user.isActive ? "Active" : "Inactive" },
            {
              label: "Member Since",
              value: new Date(user.createdAt).toLocaleDateString(),
            },
            {
              label: "Last Updated",
              value: new Date(user.updatedAt).toLocaleDateString(),
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[16px] font-mono text-gray-500 uppercase tracking-widest">
                {label}
              </span>
              <span className="font-mono text-gray-200 truncate text-[14px]">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
