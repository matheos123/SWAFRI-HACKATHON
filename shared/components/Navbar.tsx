"use client";
import { Bell, Settings, Wallet, Shield, Trophy, Swords, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { AuthUser } from "@/features/auth/api/auth.api";
import { useMatchmaking } from "@/features/game/hooks/useMatchmaking";

interface NavbarProps {
  user: AuthUser;
  onOpenWallet: () => void;
  onDisconnectWallet: () => void;
}

export default function Navbar({
  user,
  onOpenWallet,
  onDisconnectWallet,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isQueued, matchmakingStatus, joinQueue, cancelQueue } = useMatchmaking();

  const handleFindMatch = () => {
    if (isQueued) {
      cancelQueue();
    } else {
      joinQueue();
      router.push("/lobby");
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP & TABLET VIEW: FIXED TOP NAVBAR (visible on md+) */}
      {/* ========================================================= */}
      <nav
        id="app-navbar"
        className="hidden md:block sticky top-0 z-40 w-full border-b border-[#141C2F]/80 bg-[#0A0E17]/95 backdrop-blur-md px-6 py-3.5"
      >
        <div className="w-full flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-sans font-black tracking-[0.2em] text-lg text-white uppercase select-none">
              RPS <span className="text-cyan-400">Arena</span>
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3.5">
            {/* Find Match */}
            <button
              onClick={handleFindMatch}
              className={`h-10 px-6 rounded-lg text-xs font-bold font-sans tracking-widest uppercase transition-all duration-300 cursor-pointer select-none ${
                isQueued
                  ? "bg-amber-600/30 border border-amber-500/30 text-amber-200 animate-pulse"
                  : matchmakingStatus === "matched"
                    ? "bg-emerald-600/30 border border-emerald-500/30 text-emerald-200"
                    : "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-[#070B13] hover:text-white shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              }`}
            >
              {isQueued ? "In Queue... (Cancel)" : matchmakingStatus === "matched" ? "Match Found!" : "Find Match"}
            </button>

            {/* Points balance */}
            <div className="flex items-center gap-1.5 bg-[#101726] border border-gray-800 rounded-lg px-3 py-1.5">
              <span className="text-[10px] font-mono text-gray-400 font-medium">PTS:</span>
              <span className="text-xs font-bold font-mono text-cyan-300">{user.points.toLocaleString()}</span>
            </div>

            {/* Identity Profile Shortcut */}
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 px-3 h-10 rounded-lg border border-gray-800 bg-[#101726] hover:border-gray-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-cyan-500/30 to-indigo-500/30 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300 uppercase">
                {user.username[0]}
              </div>
              <span className="text-xs font-mono text-gray-300 font-semibold">{user.username}</span>
            </button>

            {/* Quick Action Panels */}
            <div className="flex items-center gap-1.5">
              <button onClick={() => alert("No new notifications.")} className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              </button>
              <button onClick={() => router.push("/settings")} className={`p-2 rounded-lg transition-colors ${pathname === "/settings" ? "text-cyan-400 bg-[#141C2F]/50" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Web3 Node Link */}
            <button
              onClick={onOpenWallet}
              className={`flex items-center gap-1.5 px-4 h-10 rounded-lg border transition-all cursor-pointer text-xs font-sans font-bold tracking-widest uppercase ${
                user.walletAddress
                  ? "border-cyan-500/25 bg-cyan-950/20 text-cyan-400 font-mono tracking-wide"
                  : "border-cyan-500/40 bg-[#101726] hover:bg-cyan-500/10 text-cyan-300"
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>{user.walletAddress ? `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}` : "Connect Wallet"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* 2. MOBILE VIEW: TOP MINI-STATUS HEADER (visible below md) */}
      {/* ========================================================= */}
      <header className="md:hidden sticky top-0 z-40 w-full flex items-center justify-between bg-[#0A0E17]/95 border-b border-[#141C2F]/60 px-4 py-3 backdrop-blur-md">
        <span className="font-sans font-black tracking-widest text-sm text-white uppercase">
          RPS <span className="text-cyan-400">Arena</span>
        </span>
        
        <div className="flex items-center gap-3">
          {/* Mobile Micro Wallet State Indicator */}
          <button 
            onClick={onOpenWallet}
            className={`p-2 rounded-lg border ${user.walletAddress ? "border-cyan-500/30 bg-cyan-950/30 text-cyan-400" : "border-slate-800 text-slate-400"}`}
          >
            <Wallet className="w-4 h-4" />
          </button>
          <div className="bg-[#101726] border border-gray-800 rounded-md px-2.5 py-1 text-[11px] font-mono font-bold text-cyan-300">
            {user.points.toLocaleString()} PTS
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. MOBILE VIEW: TACTICAL BOTTOM DOCK TAB BAR (visible below md) */}
      {/* ========================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0E17]/95 border-t border-[#141C2F]/80 backdrop-blur-lg px-2 pb-safe-bottom">
        <div className="grid grid-cols-5 items-center justify-between py-2 text-center relative">
          
          {/* Tab item 1: Dashboard Home */}
          <button 
            onClick={() => router.push("/dashboard")} 
            className={`flex flex-col items-center gap-1 py-1 text-[10px] font-bold font-sans uppercase tracking-wider ${pathname === "/dashboard" ? "text-cyan-400" : "text-slate-500"}`}
          >
            <Trophy className="w-5 h-5" />
            <span>Lobby</span>
          </button>

          {/* Tab item 2: Notifications */}
          <button 
            onClick={() => alert("No new notifications.")} 
            className="flex flex-col items-center gap-1 py-1 text-[10px] font-bold font-sans uppercase tracking-wider text-slate-500 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-6 w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Alerts</span>
          </button>

          {/* Tab item 3: CENTRAL FIND MATCH ACTION COMPONENT */}
          <div className="relative -top-5 flex justify-center">
            <button
              onClick={handleFindMatch}
              className={`h-14 w-14 rounded-full flex items-center justify-center text-white border-2 shadow-xl transform active:scale-95 transition-all ${
                isQueued
                  ? "bg-amber-600 border-amber-400 animate-pulse shadow-amber-500/20"
                  : matchmakingStatus === "matched"
                    ? "bg-emerald-600 border-emerald-400 shadow-emerald-500/20"
                    : "bg-linear-to-b from-cyan-400 to-blue-600 border-cyan-300 shadow-cyan-500/30"
              }`}
            >
              <Swords className={`w-6 h-6 ${isQueued ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Tab item 4: Profile */}
          <button 
            onClick={() => router.push("/profile")} 
            className={`flex flex-col items-center gap-1 py-1 text-[10px] font-bold font-sans uppercase tracking-wider ${pathname === "/profile" ? "text-cyan-400" : "text-slate-500"}`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>

          {/* Tab item 5: Settings */}
          <button 
            onClick={() => router.push("/settings")} 
            className={`flex flex-col items-center gap-1 py-1 text-[10px] font-bold font-sans uppercase tracking-wider ${pathname === "/settings" ? "text-cyan-400" : "text-slate-500"}`}
          >
            <Settings className="w-5 h-5" />
            <span>System</span>
          </button>

        </div>
      </div>
    </>
  );
}