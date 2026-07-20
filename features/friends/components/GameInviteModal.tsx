"use client";

import { useFriendsStore, GameInvite } from "@/features/friends/store/friends.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getSocket } from "@/shared/lib/socket";
import { useRouter } from "next/navigation";
import { Swords, Check, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function GameInviteModal() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { gameInvites, declineGameInvite } = useFriendsStore();

  const currentInvite: GameInvite | undefined = gameInvites[0];

  if (!currentInvite || !user) return null;

  const handleAccept = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit("game:invite_accept", {
        fromUserId: currentInvite.senderId,
        toUserId: user.id,
      });
    }

    declineGameInvite(currentInvite.id);
    router.push("/lobby");
  };

  const handleDecline = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit("game:invite_decline", {
        fromUserId: currentInvite.senderId,
        toUserId: user.id,
      });
    }

    declineGameInvite(currentInvite.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/40 bg-[#0C1220] p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)]"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Header Badge */}
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase mb-4">
            <ShieldAlert className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Incoming Direct Match Challenge</span>
          </div>

          {/* Icon & Title */}
          <div className="text-center py-3">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Swords className="h-8 w-8 text-cyan-300 animate-bounce" />
            </div>

            <h3 className="text-lg font-black tracking-widest text-white uppercase font-sans">
              Combat Challenge!
            </h3>

            <p className="mt-2 text-xs text-slate-300 font-mono leading-relaxed">
              <span className="font-bold text-cyan-300 uppercase">
                {currentInvite.username}
              </span>{" "}
              has challenged you to a Rock Paper Scissors Match!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleDecline}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98]"
            >
              <X className="w-4 h-4" />
              Decline
            </button>

            <button
              onClick={handleAccept}
              className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/50 bg-linear-to-r from-cyan-500 via-indigo-500 to-cyan-500 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 transition-all active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              Accept ⚔️
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
