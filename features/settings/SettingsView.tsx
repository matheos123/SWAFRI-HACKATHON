"use client";
import { useState, FormEvent } from "react";
import {
  User,
  Volume2,
  ShieldAlert,
  Check,
  RefreshCw,
  Key,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { AuthUser } from "@/features/auth/api/auth.api";

interface SettingsViewProps {
  profile: AuthUser;
  onUpdateProfileNameAndTitle: (name: string, title: string) => void;
  onDisconnectWallet: () => void;
  onOpenWallet: () => void;
}

const AVAILABLE_TITLES = [
  "Global Elite",
  "RPS Mastermind",
  "Web3 Commander",
  "Sentinel Alpha",
  "Quantum Glitch",
  "Chainrunner",
];

export default function SettingsView({
  profile,
  onUpdateProfileNameAndTitle,
  onDisconnectWallet,
  onOpenWallet,
}: SettingsViewProps) {
  const [username, setUsername] = useState(profile.username);
  const [selectedTitle, setSelectedTitle] = useState("");

  // Custom interface preferences
  const [enableSound, setEnableSound] = useState(true);
  const [autoTxLogs, setAutoTxLogs] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    onUpdateProfileNameAndTitle(username, selectedTitle);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div
      id="settings-view-container"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* 1. Core Profile Identity Editing Form */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-5 sm:p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-800/40 mb-6">
          <User className="w-4.5 h-4.5 text-cyan-400" />
          <h3 className="text-sm font-black text-white font-sans tracking-widest uppercase">
            Edit Node Metadata
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Username Input */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-mono uppercase tracking-wider font-bold">
              Commander Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-800 bg-[#070A12]/80 font-semibold text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="e.g. Archer:07"
              maxLength={15}
            />
          </div>

          {/* Commander Title Selection Grid */}
          <div className="flex flex-col gap-2.5">
            <label className="text-gray-400 font-mono uppercase tracking-wider font-bold">
              Combat Title Designation
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {AVAILABLE_TITLES.map((title) => {
                const isSelected = selectedTitle === title;
                return (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setSelectedTitle(title)}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all duration-200 uppercase tracking-wider text-[10px] select-none cursor-pointer ${
                      isSelected
                        ? "border-cyan-500/50 bg-cyan-950/20 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.1)]"
                        : "border-gray-800 hover:border-gray-700 bg-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    {title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-800/40 flex items-center justify-between gap-4">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              Syncs profile identity state locally.
            </p>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-black font-sans font-black tracking-widest text-xs uppercase hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-1.5 transition-all select-none cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Mined & Synced</span>
                </>
              ) : (
                <span>Sync Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Web3 Node Credentials and Game Preferences */}
      <div className="space-y-6">
        {/* Web3 Cryptography Actions card */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-800/40 mb-4">
            <Key className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="text-sm font-black text-white font-sans tracking-widest uppercase">
              Web3 Cryptography
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {profile.walletAddress ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-cyan-400">
                      Secure Node Address
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                  <span className="font-mono tracking-wider break-all text-[11px] block">
                    {profile.walletAddress}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] border-b border-gray-900 pb-2.5">
                  <span className="text-gray-400">Points</span>
                  <span className="text-white font-bold font-mono">
                    {profile.points.toLocaleString()} PTS
                  </span>
                </div>

                <button
                  onClick={onDisconnectWallet}
                  className="w-full py-2.5 rounded-xl border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:bg-rose-950/10 text-xs font-bold font-sans tracking-widest uppercase transition-colors select-none cursor-pointer"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-900/60 border border-gray-800/80 p-3.5 flex items-start gap-2.5">
                  <ShieldAlert className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Connect a cryptographic signature provider to enable full
                    on-chain stats logging, leaderboards, and achievements.
                  </p>
                </div>
                <button
                  onClick={onOpenWallet}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-sans tracking-widest uppercase hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all select-none cursor-pointer"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Custom Application Settings & Audio Preferences */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-800/40 mb-4">
            <Volume2 className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-sm font-black text-white font-sans tracking-widest uppercase">
              UI Preferences
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Ambient Sound effects Toggle */}
            <div className="flex items-center justify-between py-1.5">
              <div>
                <span className="text-white font-semibold block">
                  Combat Audio cues
                </span>
                <span className="text-[10px] text-gray-500 block leading-normal mt-0.5">
                  Toggle weapon animations sounds
                </span>
              </div>
              <button
                onClick={() => setEnableSound(!enableSound)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {enableSound ? (
                  <ToggleRight className="w-8 h-8 text-cyan-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-600" />
                )}
              </button>
            </div>

            {/* Auto Launch Tx details */}
            <div className="flex items-center justify-between py-1.5">
              <div>
                <span className="text-white font-semibold block">
                  Auto-Show Receipts
                </span>
                <span className="text-[10px] text-gray-500 block leading-normal mt-0.5">
                  Pop up explorer logs upon battle complete
                </span>
              </div>
              <button
                onClick={() => setAutoTxLogs(!autoTxLogs)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {autoTxLogs ? (
                  <ToggleRight className="w-8 h-8 text-cyan-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
