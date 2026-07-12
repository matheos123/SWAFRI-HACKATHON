"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, CheckCircle2, LockKeyhole, Loader2 } from "lucide-react";
import {
  getAllAchievements,
  getMyAchievements,
} from "@/features/achievements/api/achievements.api";

export default function BadgeInventory() {
  const achievementsQuery = useQuery({
    queryKey: ["achievements"],
    queryFn: getAllAchievements,
  });
  const earnedQuery = useQuery({
    queryKey: ["achievements", "me"],
    queryFn: getMyAchievements,
  });

  const isLoading = achievementsQuery.isLoading || earnedQuery.isLoading;
  const error = achievementsQuery.error ?? earnedQuery.error;
  const earnedByName = new Map(
    (earnedQuery.data ?? []).map((item) => [item.achievement.name, item]),
  );

  return (
    <section className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-gray-800/40 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Achievements
          </h3>
          <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            {earnedByName.size} of {achievementsQuery.data?.length ?? 0} earned
          </p>
        </div>
        <Award className="h-5 w-5 text-amber-400" />
      </div>

      {isLoading ? (
        <div className="flex min-h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 text-xs text-rose-400">
          {error instanceof Error ? error.message : "Failed to load achievements"}
        </div>
      ) : achievementsQuery.data?.length ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {achievementsQuery.data.map((achievement) => {
            const earned = earnedByName.get(achievement.name);

            return (
              <article
                key={achievement.id}
                className={`relative overflow-hidden rounded-xl border p-4 ${
                  earned
                    ? "border-amber-500/30 bg-amber-950/10"
                    : "border-slate-800 bg-[#080c15]/50 opacity-70"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                    {achievement.iconUrl ? (
                      <img
                        src={achievement.iconUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Award className="h-5 w-5 text-amber-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-100">
                        {achievement.name}
                      </h4>
                      {earned ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      ) : (
                        <LockKeyhole className="h-4 w-4 shrink-0 text-slate-600" />
                      )}
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3 border-t border-slate-800/70 pt-2 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                  {earned
                    ? `Earned ${new Date(earned.earnedAt).toLocaleDateString()}`
                    : achievement.criteria}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="py-8 text-center text-xs text-slate-500">
          No achievements are available yet.
        </p>
      )}
    </section>
  );
}
