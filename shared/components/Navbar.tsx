"use client";
import { Bell, Settings, Wallet, Shield, Menu, X, Swords } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isQueued, matchmakingStatus, joinQueue, cancelQueue } = useMatchmaking();

  const handleFindMatch = () => {
    if (isQueued) {
      cancelQueue();
    } else {
      joinQueue();
      router.push("/lobby");
    }
    setIsMobileMenuOpen(false); // Close menu if action taken
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ========================================== */}
      {/* GLOBAL TOP NAV BAR (Universal Layout)      */}
      {/* ========================================== */}
      <nav
        id="app-navbar"
        className="sticky top-0 z-40 w-full border-b border-[#141C2F]/80 bg-[#0A0E17]/95 backdrop-blur-md px-4 sm:px-8 py-3.5"
      >
        <div className="w-full flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo */}
          <div
            onClick={() => navigateTo("/dashboard")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-sans font-black tracking-[0.2em] text-lg text-white uppercase select-none">
              RPS <span className="text-cyan-400">Arena</span>
            </span>
          </div>

          {/* Right Actions: Desktop Layout (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* Find Match */}
            <button
              onClick={handleFindMatch}
              className={`h-10 px-6 rounded-lg text-xs font-bold font-sans tracking-widest uppercase transition-all duration-300 cursor-pointer select-none ${
                isQueued
                  ? "bg-amber-600/30 border border-amber-500/30 text-amber-200 animate-pulse"
                  : matchmakingStatus === "matched"
                    ? "bg-emerald-600/30 border border-emerald-500/30 text-emerald-200"
                    : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-[#070B13] hover:text-white shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              }`}
            >
              {isQueued ? "In Queue... (Cancel)" : matchmakingStatus === "matched" ? "Match Found!" : "Find Match"}
            </button>

            {/* Points balance */}
            <div className="flex items-center gap-1.5 bg-[#101726] border border-gray-800 rounded-lg px-3 py-1.5">
              <span className="text-[10px] font-mono text-gray-400 font-medium">PTS:</span>
              <span className="text-xs font-bold font-mono text-cyan-300">{user.points.toLocaleString()}</span>
            </div>

            {/* User Profile */}
            <button
              onClick={() => navigateTo("/profile")}
              className="flex items-center gap-2 px-3 h-10 rounded-lg border border-gray-800 bg-[#101726] hover:border-gray-700 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300 uppercase">
                {user.username[0]}
              </div>
              <span className="text-xs font-mono text-gray-300 font-semibold">{user.username}</span>
            </button>

            {/* Icons */}
            <div className="flex items-center gap-1.5">
              <button onClick={() => alert("No new notifications.")} className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              </button>
              <button onClick={() => navigateTo("/settings")} className={`p-2 rounded-lg transition-colors ${pathname === "/settings" ? "text-cyan-400 bg-[#141C2F]/50" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Wallet Integration */}
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

          {/* Mobile Right: Hamburger Menu Toggle Icon Trigger (hidden on md+) */}
          <div className="md:hidden flex items-center gap-3">
            <div className="bg-[#101726] border border-gray-800 rounded-md px-2.5 py-1.5 text-xs font-mono font-bold text-cyan-300">
              {user.points.toLocaleString()} PTS
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white bg-slate-800/20 border border-slate-800/80 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* ========================================== */}
      {/* MOBILE COLLAPSED DRAWER DRAWER OVERLAY   */}
      {/* ========================================== */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[61px] z-30 bg-[#070B13]/98 border-t border-[#141C2F]/40 flex flex-col p-6 animate-fade-in animate-duration-200">
          
          {/* Mobile Matchmaking Interface Button */}
          <button
            onClick={handleFindMatch}
            className={`w-full py-3.5 mb-6 rounded-lg flex items-center justify-center gap-2 text-xs font-bold font-sans tracking-widest uppercase transition-all duration-300 border shadow-lg ${
              isQueued
                ? "bg-amber-600/20 border-amber-500/40 text-amber-200 animate-pulse"
                : matchmakingStatus === "matched"
                  ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-200"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 text-[#070B13] font-black border-cyan-400/30"
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>{isQueued ? "In Queue... (Cancel)" : matchmakingStatus === "matched" ? "Match Found!" : "Find Match"}</span>
          </button>

          {/* Navigation Links List */}
          <div className="flex-1 space-y-2">
            <button
              onClick={() => navigateTo("/profile")}
              className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-800/60 bg-[#101726]/40 hover:bg-[#101726] text-left"
            >
              <span className="text-xs font-mono text-gray-300 font-semibold uppercase tracking-wider">
                👤 Profile ({user.username})
              </span>
              <span className="text-xs text-slate-600">➔</span>
            </button>

            <button
              onClick={() => navigateTo("/settings")}
              className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left ${
                pathname === "/settings" ? "border-cyan-500/40 bg-cyan-950/10 text-cyan-400" : "border-slate-800/60 bg-[#101726]/40"
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-wider">⚙️ System Configuration</span>
              <span className="text-xs text-slate-600">➔</span>
            </button>

            <button
              onClick={() => {
                onOpenWallet();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-lg border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-left"
            >
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                💼 {user.walletAddress ? `Wallet: ${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}` : "Connect Wallet"}
              </span>
              <span className="text-xs text-cyan-600">➔</span>
            </button>
          </div>

          {/* Alerts / System Tray Indicator Footer */}
          <div className="mt-auto border-t border-slate-900 pt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Security Framework: v1.0.4</span>
            <button onClick={() => alert("No new alerts.")} className="text-cyan-500 underline uppercase tracking-widest text-[10px] font-bold">
              Check Alerts
            </button>
          </div>

        </div>
      )}
    </>
  );
}