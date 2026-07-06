import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ExternalLink,
  ShieldCheck,
  Database,
  Layers,
  Flame,
} from "lucide-react";
import { Match } from "@/shared/types";

interface TxModalProps {
  isOpen: boolean;
  match: Match | null;
  onClose: () => void;
  walletAddress: string;
}

export default function TxModal({
  isOpen,
  match,
  onClose,
  walletAddress,
}: TxModalProps) {
  if (!match) return null;

  // Generate some deterministic mock blockchain parameters based on match parameters
  const isVictory = match.status === "VICTORY";
  const blockNumber = 18492021 + Math.floor(Math.random() * 5000);
  const gasUsed = 124392 + Math.floor(Math.random() * 10000);
  const gasPriceGwei = 24.5;
  const gasFeeEth = ((gasUsed * gasPriceGwei) / 1e9).toFixed(6);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="tx-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#0A0D16] p-6 shadow-2xl shadow-emerald-500/5"
          >
            {/* Tech Hex Grid Ornaments */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold font-sans tracking-widest text-white uppercase">
                  On-Chain Tx Receipt
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Banner */}
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 p-4">
              <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-400">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                  Transaction Confirmed
                </span>
                <span className="text-[11px] text-gray-400">
                  Included in Block #{blockNumber} with 24 Node Consensuses.
                </span>
              </div>
            </div>

            {/* Receipt Details Grid */}
            <div className="space-y-3.5 text-xs">
              {/* Tx Hash */}
              <div className="grid grid-cols-3 border-b border-gray-900 pb-2">
                <span className="text-gray-400 font-medium">
                  Transaction Hash
                </span>
                <span className="col-span-2 text-white font-mono break-all text-right">
                  {match.id === "match-1"
                    ? "0x4a8b1392dfc904e2808c1092e0761d4a0a4c5f2d"
                    : match.id === "match-2"
                      ? "0x7c9d9021fbc8a2e76fa108a4f6cc11b4a09c2e04"
                      : match.id === "match-3"
                        ? "0x2e5f0d9272fc002ea9789cb432240902c55c1b9a"
                        : `0x${match.txId}fd48b81cf9021eb3cf0d9a7812ee01cc1a0b5f5c`}
                </span>
              </div>

              {/* Smart Contract Method */}
              <div className="grid grid-cols-3 border-b border-gray-900 pb-2">
                <span className="text-gray-400 font-medium">
                  Smart Contract
                </span>
                <span className="col-span-2 font-mono text-cyan-400 text-right">
                  RPS_Arena_MatchEngine::settleMatch()
                </span>
              </div>

              {/* Status & Outcome */}
              <div className="grid grid-cols-3 border-b border-gray-900 pb-2">
                <span className="text-gray-400 font-medium">Battle Result</span>
                <span
                  className={`col-span-2 font-bold text-right ${isVictory ? "text-cyan-400" : "text-rose-400"}`}
                >
                  {isVictory ? "VICTORY" : "DEFEAT"} ({match.score})
                </span>
              </div>

              {/* Opponent Wallet */}
              <div className="grid grid-cols-3 border-b border-gray-900 pb-2">
                <span className="text-gray-400 font-medium">
                  Opponent Target
                </span>
                <span className="col-span-2 font-mono text-white text-right">
                  {match.opponent} (LVL {match.opponentLevel})
                </span>
              </div>

              {/* Timestamp */}
              <div className="grid grid-cols-3 border-b border-gray-900 pb-2">
                <span className="text-gray-400 font-medium">Timestamp</span>
                <span className="col-span-2 text-white text-right font-mono">
                  {match.timestamp}
                </span>
              </div>

              {/* Value Minted / Transferred */}
              <div className="grid grid-cols-3 border-b border-gray-900 pb-2">
                <span className="text-gray-400 font-medium">
                  Rewards Logged
                </span>
                <div className="col-span-2 text-right">
                  <div
                    className={`font-bold ${isVictory ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {isVictory ? "+" : ""}
                    {match.rewardRP} Rating Points (RP)
                  </div>
                  <div className="text-cyan-300 font-bold mt-0.5">
                    {isVictory ? `+${match.rewardRPS}` : "0"} $RPS ERC-20 Tokens
                  </div>
                </div>
              </div>

              {/* Gas Metrics */}
              <div className="grid grid-cols-3 border-b border-gray-900 pb-2">
                <span className="text-gray-400 font-medium">Gas Burned</span>
                <span className="col-span-2 text-gray-300 text-right font-mono">
                  {gasUsed.toLocaleString()} units @ {gasPriceGwei} Gwei (
                  {gasFeeEth} ETH)
                </span>
              </div>
            </div>

            {/* Footer External Links */}
            <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                <Layers className="w-3 h-3 text-gray-500" />
                <span>POLYGON AMOY TESTNET</span>
              </div>
              <a
                href="#polygonscan"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-semibold"
              >
                <span>View on PolyScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
