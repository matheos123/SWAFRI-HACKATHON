"use client";
import { Bell, Settings, Wallet, Shield } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { AuthUser } from "@/features/auth/api/auth.api";

interface NavbarProps {
  user: AuthUser;
  onOpenWallet: () => void;
  onDisconnectWallet: () => void;
  onTriggerFindMatch: () => void;
  isQueueActive: boolean;
}

export default function Navbar({
  user,
  onOpenWallet,
  onDisconnectWallet,
  onTriggerFindMatch,
  isQueueActive,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      id="app-navbar"
      className="sticky top-0 z-40 w-full border-b border-[#141C2F]/80 bg-[#0A0E17]/95 backdrop-blur-md px-4 sm:px-8 py-3.5"
    >
      <div className="w-full flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Shield className="w-4.5 h-4.5 text-white" />
            <div className="absolute inset-0 rounded-lg border border-white/20 group-hover:scale-105 transition-transform" />
          </div>
          <span className="font-sans font-black tracking-[0.2em] text-lg text-white uppercase select-none">
            RPS <span className="text-cyan-400">Arena</span>
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3.5">
          {/* Find Match */}
          <button
            onClick={() => {
              onTriggerFindMatch();
              router.push("/lobby");
            }}
            disabled={isQueueActive}
            className={`h-10 px-6 rounded-lg text-xs font-bold font-sans tracking-widest uppercase transition-all duration-300 select-none ${
              isQueueActive
                ? "bg-amber-600/30 border border-amber-500/30 text-amber-200 animate-pulse cursor-not-allowed"
                : "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-[#070B13] hover:text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] cursor-pointer"
            }`}
          >
            {isQueueActive ? "In Queue..." : "Find Match"}
          </button>

          {/* Points balance */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#101726] border border-gray-800 rounded-lg px-3 py-1.5">
            <span className="text-[10px] font-mono text-gray-400 font-medium">
              PTS:
            </span>
            <span className="text-xs font-bold font-mono text-cyan-300">
              {user.points.toLocaleString()}
            </span>
          </div>

          {/* User avatar + username */}
          <button
            onClick={() => router.push("/profile")}
            className="hidden sm:flex items-center gap-2 px-3 h-10 rounded-lg border border-gray-800 bg-[#101726] hover:border-gray-700 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-cyan-500/30 to-indigo-500/30 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300 uppercase">
              {user.username[0]}
            </div>
            <span className="text-xs font-mono text-gray-300 font-semibold">
              {user.username}
            </span>
          </button>

          {/* Icons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                alert(
                  "No new notifications on-chain. Subscribe to smart contract alerts!",
                )
              }
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            </button>
            <button
              onClick={() => router.push("/settings")}
              className={`p-2 rounded-lg transition-colors ${
                pathname === "/settings"
                  ? "text-cyan-400 bg-[#141C2F]/50"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Wallet */}
          {user.walletAddress ? (
            <button
              onClick={onDisconnectWallet}
              title="Click to disconnect wallet"
              className="flex items-center gap-2 px-3.5 h-10 rounded-lg border border-cyan-500/25 bg-cyan-950/20 text-cyan-400 text-xs font-mono font-bold tracking-wide hover:bg-rose-950/20 hover:border-rose-500/30 hover:text-rose-400 transition-all duration-300"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>
                {user.walletAddress.slice(0, 6)}...
                {user.walletAddress.slice(-4)}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-1.5 px-4 h-10 rounded-lg border border-cyan-500/40 bg-[#101726] hover:bg-cyan-500/10 text-cyan-300 text-xs font-sans font-bold tracking-widest uppercase transition-all cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden xs:inline">Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
