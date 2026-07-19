"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Loader2, Wallet, RefreshCw } from "lucide-react";
import { useSiweLogin } from "@/features/auth/hooks/useSiweLogin";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function Web3Providers() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { isLoading, error, loginWithWallet, disconnectAndReconnect, clearError } =
    useSiweLogin();
  const user = useAuthStore((s) => s.user);

  // Redirect after successful SIWE login
  useEffect(() => {
    if (user) {
      router.push("/lobby");
    }
  }, [user, router]);

  return (
    <div className="space-y-2.5">
      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-[11px] text-rose-400 font-mono flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="ml-2 text-rose-500 hover:text-rose-300 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── CONNECTED STATE ──────────────────────────────────────────────── */}
      {isConnected && address ? (
        <div className="space-y-2">
          {/* Connected address pill */}
          <div className="flex items-center gap-2 rounded-md border border-slate-700/60 bg-[#141926] px-3 py-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              Wallet detected:
            </span>
            <span className="ml-auto text-[10px] font-mono text-cyan-300 font-bold">
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          </div>

          {/* Primary: sign in with detected wallet */}
          <button
            onClick={loginWithWallet}
            disabled={isLoading}
            type="button"
            className="group flex w-full items-center justify-between rounded-md border border-indigo-500/30 bg-indigo-950/20 px-3 py-3 text-sm font-medium text-slate-200 transition-all hover:border-indigo-500/50 hover:bg-indigo-950/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-indigo-500/20 border border-indigo-500/30 shrink-0">
                <Wallet className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors tracking-wide block">
                  {isLoading ? "Waiting for signature…" : "Continue with this wallet"}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Sign to verify ownership · Base Sepolia
                </span>
              </div>
            </div>
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-500 group-hover:text-slate-300 transition-colors shrink-0"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </button>

          {/* Secondary: switch to a different wallet */}
          <button
            onClick={disconnectAndReconnect}
            disabled={isLoading}
            type="button"
            className="group flex w-full items-center justify-center gap-2 rounded-md border border-slate-800/60 bg-[#141926] px-3 py-2.5 text-xs font-medium text-slate-400 transition-all hover:border-slate-700/80 hover:bg-[#1a2030] hover:text-slate-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            Use a different wallet
          </button>
        </div>
      ) : (
        /* ── NOT CONNECTED STATE ────────────────────────────────────────── */
        <div className="space-y-2">
          {/* MetaMask / primary wallet */}
          <button
            onClick={loginWithWallet}
            disabled={isLoading}
            type="button"
            className="group flex w-full items-center justify-between rounded-md border border-slate-800/60 bg-[#141926] px-3 py-3 text-sm font-medium text-slate-300 transition-all hover:border-slate-700/80 hover:bg-[#1a2030] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            <div className="flex items-center gap-3">
              {/* MetaMask fox-orange icon */}
              <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#e27625] shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <path d="M3.3 7l8.7 5 8.7-5" stroke="white" strokeWidth="2" fill="none" />
                  <path d="M12 22V12" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors tracking-wide block">
                  {isLoading ? "Connecting wallet…" : "Sign in with MetaMask"}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Base Sepolia · auto-creates account on first sign
                </span>
              </div>
            </div>
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-500 group-hover:text-slate-300 transition-colors shrink-0"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </button>

          {/* Other wallets — opens RainbowKit picker */}
          <button
            onClick={loginWithWallet}
            disabled={isLoading}
            type="button"
            className="group flex w-full items-center justify-between rounded-md border border-slate-800/60 bg-[#141926] px-3 py-3 text-sm font-medium text-slate-300 transition-all hover:border-slate-700/80 hover:bg-[#1a2030] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            <div className="flex items-center gap-3">
              {/* WalletConnect / generic icon */}
              <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#0052ff] shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors tracking-wide">
                Other Wallets
              </span>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-500 group-hover:text-slate-300 transition-colors shrink-0"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
