"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, ShieldCheck, Swords } from "lucide-react";
import { getReplay } from "@/features/replay/api/replay.api";

export default function SpectateReplayPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);
  const replayQuery = useQuery({
    queryKey: ["replay", matchId],
    queryFn: () => getReplay(matchId),
  });

  if (replayQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070A13]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </main>
    );
  }

  if (replayQuery.error || !replayQuery.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070A13] p-6">
        <div className="w-full max-w-lg rounded-2xl border border-rose-500/20 bg-[#0C1220] p-6 text-center">
          <h1 className="text-lg font-bold text-white">Replay unavailable</h1>
          <p className="mt-2 text-sm text-rose-400">
            {replayQuery.error instanceof Error
              ? replayQuery.error.message
              : "This replay could not be loaded."}
          </p>
          <Link
            href="/profile"
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" /> Back to profile
          </Link>
        </div>
      </main>
    );
  }

  const replay = replayQuery.data;
  const matchDate = new Date(replay.createdAt);

  return (
    <main className="min-h-screen bg-[#070A13] px-4 py-8 text-slate-200 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-cyan-400"
        >
          <ArrowLeft className="h-4 w-4" /> Profile
        </Link>

        <section className="rounded-2xl border border-slate-800 bg-[#0C1220]/80 p-6 shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black uppercase tracking-wide text-white">
                  Match Replay
                </h1>
                {replay.isRanked ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-[10px] font-bold uppercase text-cyan-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> Ranked
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {replay.player1.username} vs {replay.player2.username}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {Number.isNaN(matchDate.getTime())
                  ? replay.createdAt
                  : matchDate.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 px-5 py-4 text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Final Score
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                <span className="text-cyan-300">{replay.player1Wins}</span>
                <span className="px-2 text-slate-600">-</span>
                <span className="text-rose-300">{replay.player2Wins}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Player One
              </div>
              <p className="mt-2 text-lg font-bold text-white">
                {replay.player1.username}
              </p>
              <p className="font-mono text-xs text-slate-500">
                {replay.player1.userId ?? "Unknown user"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Player Two
              </div>
              <p className="mt-2 text-lg font-bold text-white">
                {replay.player2.username}
              </p>
              <p className="font-mono text-xs text-slate-500">
                {replay.player2.userId ?? "Unknown user"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#0C1220]/50 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              Round Timeline
            </h2>
            <Swords className="h-5 w-5 text-cyan-400" />
          </div>

          {replay.rounds.length ? (
            <div className="space-y-3">
              {replay.rounds.map((round) => {
                const roundWinner =
                  round.winnerId === replay.player1.userId
                    ? replay.player1.username
                    : round.winnerId === replay.player2.userId
                      ? replay.player2.username
                      : "Draw";

                return (
                  <article
                    key={round.roundNumber}
                    className="rounded-xl border border-slate-800 bg-slate-950/30 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">
                          Round {round.roundNumber}
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          {replay.player1.username}:{" "}
                          <span className="font-semibold text-white">
                            {round.player1Move ?? "Unknown"}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          {replay.player2.username}:{" "}
                          <span className="font-semibold text-white">
                            {round.player2Move ?? "Unknown"}
                          </span>
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs font-semibold text-slate-300">
                        Winner: <span className="text-white">{roundWinner}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              This replay does not include round-by-round telemetry yet, but the
              final match record is available above.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
