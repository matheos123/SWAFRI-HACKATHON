"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getSocket } from "@/shared/lib/socket";

export interface SpectatorReaction {
  id: string;
  roomId: string;
  emoji: string;
  username: string;
}

interface FloatingParticle extends SpectatorReaction {
  xOffset: number;
}

export function FloatingReactionsOverlay({ roomId }: { roomId?: string }) {
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  const addParticle = useCallback((reaction: SpectatorReaction) => {
    const particle: FloatingParticle = {
      ...reaction,
      xOffset: Math.floor(Math.random() * 160) - 80, // -80px to +80px horizontal offset
    };

    setParticles((prev) => [...prev.slice(-15), particle]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== particle.id));
    }, 2400);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const socket = getSocket();

    const handleReaction = (data: SpectatorReaction) => {
      if (data.roomId === roomId) {
        addParticle(data);
      }
    };

    socket.on("spectate:reaction_received", handleReaction);

    return () => {
      socket.off("spectate:reaction_received", handleReaction);
    };
  }, [roomId, addParticle]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40, scale: 0.5, x: p.xOffset }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -220,
              scale: [0.6, 1.4, 1],
              x: p.xOffset + Math.sin(p.xOffset) * 20,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center select-none"
          >
            <span className="text-3xl drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
              {p.emoji}
            </span>
            <span className="mt-0.5 rounded-full border border-cyan-500/30 bg-[#0C1220]/90 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-cyan-300 shadow-md">
              {p.username}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function SpectatorEmojiBar({
  onSendEmoji,
}: {
  onSendEmoji: (emoji: string) => void;
}) {
  const EMOJIS = ["🔥", "👏", "👑", "💥", "😱", "⚡", "💩"];

  return (
    <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/60 p-2 backdrop-blur-sm">
      <span className="mr-1 font-mono text-[9px] font-bold uppercase tracking-widest text-cyan-400">
        Reactions:
      </span>
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSendEmoji(emoji)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/50 text-base transition-all hover:scale-125 hover:border-cyan-400 hover:bg-slate-700/80 active:scale-95"
          title={`Send ${emoji} reaction`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
