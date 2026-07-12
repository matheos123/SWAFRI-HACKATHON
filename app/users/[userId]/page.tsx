"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  Flame,
  Loader2,
  ShieldCheck,
  Swords,
  TrendingUp,
} from "lucide-react";
import { getPublicUserProfile } from "@/features/users/api/users.api";
import { getUserAchievements } from "@/features/achievements/api/achievements.api";
import { getUserReplayHistory } from "@/features/replay/api/replay.api";
import MatchHistoryTable from "@/features/replay/components/MatchHistoryTable";

export default function PublicUserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const profileQuery = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getPublicUserProfile(userId),
  });
  const achievementsQuery = useQuery({
    queryKey: ["achievements", "user", userId],
    queryFn: () => getUserAchievements(userId),
  });
  const historyQuery = useQuery({
    queryKey: ["replay", "history", "user", userId],
    queryFn: () => getUserReplayHistory(userId, 8),
  });

  if (profileQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070A13]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </main>
    );
  }

  if (profileQuery.error || !profileQuery.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070A13] p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-500/20 bg-[#0C1220] p-6 text-center">
          <h1 className="text-lg font-bold text-white">Player unavailable</h1>
          <p className="mt-2 text-sm text-rose-400">
            {profileQuery.error instanceof Error
              ? profileQuery.error.message
              : "This player profile could not be found."}
          </p>
          <Link
            href="/leaderboard"
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" /> Back to leaderboard
          </Link>
        </div>
      </main>
    );
  }

  const profile = profileQuery.data;
  const winRate = profile.totalMatches
    ? ((profile.wins / profile.totalMatches) * 100).toFixed(1)
    : "0.0";

  const stats = [
    { label: "Matches", value: profile.totalMatches, icon: Swords },
    { label: "Wins", value: profile.wins, icon: Award },
    { label: "Win Rate", value: `${winRate}%`, icon: TrendingUp },
    { label: "Best Streak", value: profile.longestStreak, icon: Flame },
  ];

  return (
    <main className="min-h-screen bg-[#070A13] px-4 py-8 text-slate-200 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-cyan-400"
        >
          <ArrowLeft className="h-4 w-4" /> Leaderboard
        </Link>

        <section className="rounded-2xl border border-slate-800 bg-[#0C1220]/80 p-6 shadow-xl">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-cyan-500/30 bg-slate-900">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-black uppercase text-cyan-300">
                  {profile.username[0]}
                </span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <h1 className="text-3xl font-black uppercase tracking-wide text-white">
                  {profile.username}
                </h1>
                {profile.walletAddress && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-[10px] font-bold uppercase text-cyan-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> On-chain verified
                  </span>
                )}
              </div>
              <p className="mt-2 font-mono text-xs text-slate-500">
                {profile.walletAddress ?? "Unranked player"}
              </p>
              <div className="mt-4 flex justify-center gap-3 sm:justify-start">
                <span className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs">
                  <strong className="text-cyan-300">{profile.points}</strong> points
                </span>
                <span className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs">
                  <strong className="text-amber-300">{profile.currentStreak}</strong> current streak
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-800 bg-[#0C1220]/60 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {label}
                </span>
                <Icon className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-white">{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#0C1220]/50 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              Earned Achievements
            </h2>
            <Award className="h-5 w-5 text-amber-400" />
          </div>
          {achievementsQuery.isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            </div>
          ) : achievementsQuery.error ? (
            <p className="text-xs text-rose-400">Could not load achievements.</p>
          ) : achievementsQuery.data?.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {achievementsQuery.data.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4"
                >
                  <h3 className="text-xs font-bold uppercase text-amber-300">
                    {item.achievement.name}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    {item.achievement.description}
                  </p>
                  <p className="mt-3 font-mono text-[9px] uppercase text-slate-500">
                    Earned {new Date(item.earnedAt).toLocaleDateString()}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-xs text-slate-500">
              No achievements earned yet.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#0C1220]/50 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              Recent Ranked Matches
            </h2>
            <Swords className="h-5 w-5 text-cyan-400" />
          </div>
          <MatchHistoryTable
            entries={historyQuery.data ?? []}
            isLoading={historyQuery.isLoading}
            error={
              historyQuery.error instanceof Error
                ? historyQuery.error.message
                : null
            }
            emptyMessage="No public ranked match history is available yet."
          />
        </section>
      </div>
    </main>
  );
}
