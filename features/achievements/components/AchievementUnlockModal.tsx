"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAchievementNotifications } from "../hooks/useAchievements";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function AchievementUnlockModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [badgeData, setBadgeData] = useState<{ name: string; bonusPoints: number; iconUrl?: string } | null>(null);
  const { width, height } = useWindowSize();

  useAchievementNotifications((badgeName, bonusPoints, iconUrl) => {
    setBadgeData({ name: badgeName, bonusPoints, iconUrl });
    setIsOpen(true);
  });

  if (!isOpen || !badgeData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0A0F1D]/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          className="relative w-full max-w-sm rounded-2xl border border-cyan-500/50 bg-[#0C1220] p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)] text-center overflow-hidden"
        >
          {/* Animated background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />

          <h2 className="relative text-sm font-black font-mono text-cyan-400 tracking-[0.3em] uppercase mb-8">
            Achievement Unlocked
          </h2>

          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="relative w-32 h-32 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          >
            {badgeData.iconUrl ? (
              <img src={badgeData.iconUrl} alt={badgeData.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-slate-800 rounded-full border-4 border-cyan-400 flex items-center justify-center text-5xl">
                🎖️
              </div>
            )}
          </motion.div>

          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative text-2xl font-black text-white font-mono uppercase tracking-widest mb-2"
          >
            {badgeData.name}
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative inline-block px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider mb-8"
          >
            +{badgeData.bonusPoints} Bonus Points
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => setIsOpen(false)}
            className="relative w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#0C1220] py-3 text-xs font-black uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
