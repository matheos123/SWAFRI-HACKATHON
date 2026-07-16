"use client";

import { useAchievements } from "../hooks/useAchievements";
import { Loader2 } from "lucide-react";

export default function BadgeCollection() {
  const { allBadges, myBadges, isLoading } = useAchievements();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const earnedBadgeIds = new Set(myBadges.map((b) => b.achievement.id));

  return (
    <div className="p-6 bg-[#0d111a] rounded-2xl border border-slate-800">
      <h2 className="text-xl font-black font-mono text-white tracking-widest uppercase mb-6">
        Achievement Badges
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {allBadges.map((badge) => {
          const isUnlocked = earnedBadgeIds.has(badge.id);
          const earnedInfo = myBadges.find((b) => b.achievement.id === badge.id);

          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                isUnlocked
                  ? "border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                  : "border-slate-800 bg-slate-900/50 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
              }`}
            >
              <div className="w-16 h-16 relative mb-4">
                {badge.iconUrl ? (
                  <img src={badge.iconUrl} alt={badge.name} className="w-full h-full object-contain drop-shadow-lg" />
                ) : (
                  <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-2xl">
                    🎖️
                  </div>
                )}
              </div>
              <h3 className="text-xs font-bold text-center text-white font-mono uppercase tracking-widest mb-2">
                {badge.name}
              </h3>
              <p className="text-[10px] text-center text-slate-400 font-sans mb-3 line-clamp-3">
                {badge.description}
              </p>
              
              {isUnlocked && earnedInfo ? (
                <div className="mt-auto text-[9px] text-cyan-400 font-mono tracking-wider">
                  Earned {new Date(earnedInfo.earnedAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="mt-auto text-[9px] text-slate-500 font-mono tracking-wider">
                  Locked
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
