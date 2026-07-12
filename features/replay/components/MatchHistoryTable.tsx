"use client";

import Link from "next/link";
import { Eye, ExternalLink, Loader2 } from "lucide-react";
import { ReplayHistoryEntry } from "@/features/replay/api/replay.api";

interface MatchHistoryTableProps {
  entries: ReplayHistoryEntry[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage: string;
  onOpenTx?: (matchId: string) => void;
  txEnabled?: boolean;
}

export default function MatchHistoryTable({
  entries,
  isLoading = false,
  error,
  emptyMessage,
  onOpenTx,
  txEnabled = false,
}: MatchHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (error) {
    return <p className="text-xs text-rose-400">{error}</p>;
  }

  if (!entries.length) {
    return <p className="text-xs text-slate-500">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="space-y-3 sm:hidden">
        {entries.map((entry) => (
          <article
            key={entry.matchId}
            className="rounded-xl border border-slate-800 bg-slate-950/20 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className={`text-[11px] font-bold uppercase tracking-[0.18em] ${
                    entry.status === "VICTORY"
                      ? "text-emerald-400"
                      : entry.status === "DRAW"
                        ? "text-amber-300"
                        : "text-rose-400"
                  }`}
                >
                  {entry.status}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-white">
                  {entry.opponent.username}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {entry.score} • {entry.timestampLabel}
                </p>
              </div>
              <span className="text-right text-[11px] text-cyan-300">
                +{entry.rewardRPS} $RPS
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-200">
                {entry.rewardRP >= 0 ? "+" : ""}
                {entry.rewardRP} RP
              </span>
              <div className="flex items-center gap-2">
                {txEnabled && onOpenTx ? (
                  <button
                    onClick={() => onOpenTx(entry.matchId)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Tx
                  </button>
                ) : null}
                <Link
                  href={`/spectate/${entry.matchId}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-300"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Replay
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-hidden">
      <table className="w-full table-fixed text-left">
        <thead>
          <tr className="border-b border-slate-800 text-[10px] uppercase tracking-[0.22em] text-slate-500">
            <th className="px-3 py-3">Result</th>
            <th className="px-3 py-3">Opponent</th>
            <th className="px-3 py-3">Score</th>
            <th className="px-3 py-3">Rewards</th>
            <th className="px-3 py-3">Played</th>
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-900/80 text-sm text-slate-200">
          {entries.map((entry) => {
            const statusColor =
              entry.status === "VICTORY"
                ? "text-emerald-400"
                : entry.status === "DRAW"
                  ? "text-amber-300"
                  : "text-rose-400";

            return (
              <tr key={entry.matchId} className="hover:bg-slate-950/30">
                <td className={`px-3 py-4 font-semibold ${statusColor}`}>
                  {entry.status}
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      {entry.opponent.username}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {entry.isRanked ? "Ranked" : "Casual"}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 font-mono text-slate-300">
                  {entry.score}
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-col">
                    <span
                      className={
                        entry.rewardRP >= 0 ? "text-emerald-400" : "text-rose-400"
                      }
                    >
                      {entry.rewardRP >= 0 ? "+" : ""}
                      {entry.rewardRP} RP
                    </span>
                    <span className="text-[11px] text-cyan-300">
                      +{entry.rewardRPS} $RPS
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 text-slate-400">{entry.timestampLabel}</td>
                <td className="px-3 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {txEnabled && onOpenTx ? (
                      <button
                        onClick={() => onOpenTx(entry.matchId)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Tx
                      </button>
                    ) : null}
                    <Link
                      href={`/spectate/${entry.matchId}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 px-3 py-1.5 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-950/20"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Replay
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
}
