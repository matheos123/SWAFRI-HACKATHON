"use client";
import { useState, FormEvent } from "react";
import {
  User,
  Volume2,
  ShieldAlert,
  Check,
  Key,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import { AuthUser } from "@/features/auth/api/auth.api";
import { useUpdateProfile } from "@/features/users/hooks/useUpdateProfile";

interface SettingsViewProps {
  profile: AuthUser;
  onUpdateProfileNameAndTitle: (name: string, title: string) => void; // kept for compat
  onDisconnectWallet: () => void;
  onOpenWallet: () => void;
}

export default function SettingsView({
  profile,
  onDisconnectWallet,
  onOpenWallet,
}: SettingsViewProps) {
  const [username, setUsername] = useState(profile.username);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar ?? "");
  const [enableSound, setEnableSound] = useState(true);
  const [autoTxLogs, setAutoTxLogs] = useState(true);

  const { isLoading, error, success, update } = useUpdateProfile();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const payload: { username?: string; avatar?: string } = {};
    if (username !== profile.username) payload.username = username.trim();
    if (avatarUrl !== (profile.avatar ?? ""))
      payload.avatar = avatarUrl.trim() || undefined;

    if (Object.keys(payload).length === 0) return; // nothing changed
    await update(payload);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Edit Form */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-5 sm:p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-800/40 mb-6">
          <User className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black text-white font-sans tracking-widest uppercase">
            Edit Profile
          </h3>
        </div>

        {/* Error / success banners */}
        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/20 px-4 py-3 text-xs text-rose-400 font-mono">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-4 py-3 text-xs text-emerald-400 font-mono flex items-center gap-2">
            <Check className="w-4 h-4" /> Profile updated successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 font-mono uppercase tracking-wider font-bold">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-gray-800 bg-[#070A12]/80 font-semibold text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="e.g. Archer:07"
              maxLength={20}
              minLength={3}
            />
          </div>

          {/* Avatar Selection & URL */}
          <div className="flex flex-col gap-3">
            <label className="text-gray-400 font-mono uppercase tracking-wider font-bold">
              Choose Avatar
            </label>

            {/* Preset Avatar Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {[
                { name: "Cyber Samurai", url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80" },
                { name: "Void Valkyrie", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80" },
                { name: "Mecha Pilot", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80" },
                { name: "Neon Ninja", url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80" },
                { name: "Astral Sentinel", url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=150&auto=format&fit=crop&q=80" },
                { name: "Quantum Mage", url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=80" },
                { name: "Sol Warrior", url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=150&auto=format&fit=crop&q=80" },
                { name: "Cyber Punk", url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=150&auto=format&fit=crop&q=80" },
              ].map((preset) => {
                const isSelected = avatarUrl === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`relative aspect-square overflow-hidden rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-cyan-400 ring-2 ring-cyan-500/50 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        : "border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600"
                    }`}
                    title={preset.name}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-cyan-300 drop-shadow-md" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom URL Input & Active Preview */}
            <div className="mt-2 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl border border-gray-800 bg-slate-900/60 overflow-hidden flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-lg font-black font-mono text-cyan-300 uppercase">
                    {username[0]}
                  </span>
                )}
              </div>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl border border-gray-800 bg-[#070A12]/80 font-semibold text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                placeholder="Or paste custom image URL (https://...)"
              />
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl("")}
                  className="px-3 h-11 rounded-xl border border-gray-800 text-gray-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-mono transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Save */}
          <div className="pt-4 border-t border-gray-800/40 flex items-center justify-between gap-4">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              Changes are saved to your account on the server.
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-black font-sans font-black tracking-widest text-xs uppercase hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-1.5 transition-all select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4" /> Saved
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Right column: Wallet + Preferences */}
      <div className="space-y-6">
        {/* Wallet card */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-800/40 mb-4">
            <Key className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-black text-white font-sans tracking-widest uppercase">
              Web3 Wallet
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {profile.walletAddress ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-cyan-400">
                      Connected Address
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
                  className="w-full py-2.5 rounded-xl border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:bg-rose-950/10 text-xs font-bold font-sans tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-900/60 border border-gray-800/80 p-3.5 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Connect a wallet to enable ranked matches, leaderboard
                    tracking, and achievements.
                  </p>
                </div>
                <button
                  onClick={onOpenWallet}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-widest uppercase transition-all cursor-pointer"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
