"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Wallet, ShieldAlert, CheckCircle, Loader2, Unlink } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useSiweAuth } from "@/features/auth/hooks/useSiweAuth";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { disconnectWallet } from "@/features/wallet/api/wallet.api";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (address: string) => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { address, isConnected } = useAccount();
  const {
    connectors,
    connect,
    error: connectError,
    isPending: isWalletConnecting,
  } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnecting, error, verifyAndLink, clearError } = useSiweAuth();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [disconnectError, setDisconnectError] = useState<string | null>(null);

  const handleClose = () => {
    clearError();
    setDisconnectError(null);
    onClose();
  };

  const handleVerify = async () => {
    await verifyAndLink();
    // If wallet is now linked, close modal
    // const updated = useAuthStore.getState().user;
    // if (updated?.walletAddress) {
    //   onClose();
    // }
  };

  const handleDisconnect = async () => {
    if (
      !window.confirm(
        "Unlink this wallet from your RPS Arena account? You can connect a different wallet immediately afterward.",
      )
    ) {
      return;
    }

    setIsDisconnecting(true);
    setDisconnectError(null);
    try {
      await disconnectWallet();
      try {
        await disconnectAsync();
      } catch {
        // The backend unlink succeeded. A stale connector must not prevent the
        // account from reflecting its canonical unlinked state.
      }
      // Clear wallet fields from store without logging the user out
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({
          ...currentUser,
          walletAddress: null,
          blockchainProfileId: null,
          walletVerifiedAt: null,
        });
      }
      // Keep the modal open. Clearing the stored address switches this modal
      // directly to wallet selection so the user can correct a wrong wallet.
    } catch (err: unknown) {
      setDisconnectError(
        err instanceof Error ? err.message : "Failed to disconnect wallet.",
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Already connected on backend — show address + disconnect option
  if (user?.walletAddress) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-2xl border border-cyan-500/30 bg-[#0E131F]/95 p-6 shadow-2xl text-center"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

              {/* Close button */}
              <button
                onClick={handleClose}
                title="Close"
                aria-label="Close"
                className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <CheckCircle className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-bold font-sans tracking-wide uppercase mb-1">
                Wallet Connected
              </h3>
              <p className="text-xs text-gray-400 font-mono mb-5">
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </p>

              <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
                Unlink this address if you connected the wrong wallet. You can
                select a replacement immediately afterward.
              </p>

              {/* Disconnect error */}
              {disconnectError && (
                <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/20 px-4 py-3 text-xs text-rose-400 font-mono">
                  {disconnectError}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                  className="w-full py-2.5 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-400 text-xs font-bold tracking-widest uppercase hover:bg-rose-500/20 hover:border-rose-500/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDisconnecting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <Unlink className="w-3.5 h-3.5" />
                      Unlink & Change Wallet
                    </>
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-xl border border-slate-700/50 text-slate-400 text-xs font-bold tracking-widest uppercase hover:bg-slate-800/40 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0E131F]/95 p-6 shadow-2xl shadow-cyan-500/10"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold font-sans tracking-wide text-white uppercase">
                  Connect Web3 Wallet
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={handleClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-3 mb-5">
              {["Connect Wallet", "Sign & Verify"].map((step, i) => {
                const done = i === 0 && isConnected;
                const active =
                  (i === 0 && !isConnected) || (i === 1 && isConnected);
                return (
                  <div key={step} className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        done
                          ? "bg-cyan-500 text-black"
                          : active
                            ? "bg-cyan-500/20 border border-cyan-500 text-cyan-400"
                            : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider ${active ? "text-cyan-400" : "text-gray-500"}`}
                    >
                      {step}
                    </span>
                    {i === 0 && (
                      <div className="flex-1 h-px bg-gray-800 mx-1" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Info */}
            <div className="mb-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 p-3.5 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-200/90 leading-relaxed">
                {!isConnected
                  ? "Step 1: Select and connect your wallet using RainbowKit."
                  : "Step 2: Sign a message to prove ownership and link your wallet to your RPS Arena account."}
              </p>
            </div>

            {/* Error */}
            {(error || connectError) && (
              <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/20 px-4 py-3 text-xs text-rose-400 font-mono">
                {error || connectError?.message}
              </div>
            )}

            {/* Step 1: connect directly through Wagmi. Keeping wallet
                selection inside this modal avoids the nested RainbowKit modal
                failure seen with React 19 in the account-linking flow. */}
            {!isConnected && (
              <div className="space-y-2 py-1">
                {connectors.map((connector) => {
                  return (
                    <button
                      key={connector.uid}
                      type="button"
                      onClick={() => connect({ connector })}
                      disabled={isWalletConnecting}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-700/70 bg-[#141C2F]/60 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors hover:border-cyan-500/40 hover:bg-cyan-950/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="flex items-center gap-2.5">
                        <Wallet className="h-4 w-4 text-cyan-400" />
                        {connector.name}
                      </span>
                      {isWalletConnecting && (
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                      )}
                    </button>
                  );
                })}
                {connectors.length === 0 && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-xs text-amber-300">
                    No compatible wallet was detected. Install a browser wallet
                    such as MetaMask and refresh this page.
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Sign & link to backend */}
            {isConnected && (
              <div className="space-y-3">
                <div className="rounded-xl bg-[#141C2F]/60 border border-gray-800 p-3.5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                      Connected
                    </p>
                    <p className="text-sm font-mono text-white font-bold">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={isConnecting}
                  className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-black font-bold text-xs tracking-widest uppercase hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Waiting for signature...
                    </>
                  ) : (
                    "Sign & Link Wallet"
                  )}
                </button>
              </div>
            )}

            <div className="mt-5 text-center">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Secured by Cryptographic Signatures
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
