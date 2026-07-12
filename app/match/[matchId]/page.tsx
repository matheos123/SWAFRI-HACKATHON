"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Home } from "lucide-react";
import { useGameStore, Move } from "@/features/game/store/game.store";
import { useGameSocket } from "@/features/game/hooks/useGameSocket";
import { useSocketStore } from "@/features/game/store/socket.store";
import { useAuthStore } from "@/features/auth/store/auth.store";

const MOVE_ACTIONS: { name: Move; label: string; src: string }[] = [
  { name: "rock", label: "Rock", src: "/rock-icon.png" },
  { name: "paper", label: "Paper", src: "/paper-icon.png" },
  { name: "scissors", label: "Scissors", src: "/scissors-icon.png" },
];

const MOVE_EMOJI: Record<Move, string> = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

// ── Round timer 

function useRoundTimer(active: boolean, seconds = 30) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
    if (!active) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [active, seconds]);

  return timeLeft;
}

// ── Main page 

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const { user } = useAuthStore();
  const { matchData } = useSocketStore();
  const {
    roomId,
    phase,
    currentRound,
    myMove,
    opponentMoved,
    roundResult,
    matchResult,
    rematchRequested,
    myWins,
    opponentWins,
    opponent,
    isRanked,
    initGame,
    resetGame,
  } = useGameStore();

  const { submitMove, requestRematch } = useGameSocket(roomId ?? "");
  const timeLeft = useRoundTimer(phase === "selecting", 30);

  // Init game state from matchmaking data
  useEffect(() => {
    if (matchData && matchData.matchId === matchId) {
      initGame(matchData);
    }
  }, [matchId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLeave = () => {
    resetGame();
    router.push("/lobby");
  };

  if (!user) return null;

  // ── Match result screen

  if (phase === "finished" && matchResult) {
    const iWon = matchResult.winnerId === user.id;
    const isDraw = matchResult.winnerId === null;

    return (
      <div className="min-h-screen bg-[#0d111a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Result card */}
          <div className="rounded-xl border border-slate-800 bg-[#0d111a]/80 p-8 shadow-xl relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className={`text-7xl mb-4 ${iWon ? "animate-bounce" : ""}`}>
              {isDraw ? "🤝" : iWon ? "🏆" : "💀"}
            </div>

            <h1
              className={`text-3xl font-black font-mono uppercase tracking-widest mb-6 ${
                iWon
                  ? "text-indigo-400"
                  : isDraw
                    ? "text-amber-400"
                    : "text-rose-400"
              }`}
            >
              {isDraw ? "Draw!" : iWon ? "Victory!" : "Defeat"}
            </h1>

            {/* Score */}
            <div className="flex justify-center gap-12 mb-6">
              <div className="text-center">
                <div className="text-4xl font-black font-mono text-indigo-400">
                  {matchResult.player1Wins}
                </div>
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">
                  {user.username}
                </div>
              </div>
              <div className="text-slate-600 text-2xl font-black font-mono self-center">
                vs
              </div>
              <div className="text-center">
                <div className="text-4xl font-black font-mono text-rose-400">
                  {matchResult.player2Wins}
                </div>
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">
                  {opponent?.username ?? "Opponent"}
                </div>
              </div>
            </div>

            {/* Ranked badge */}
            {matchResult.isRanked ? (
              <div className="rounded-lg bg-indigo-950/40 border border-indigo-500/20 p-3 text-xs text-indigo-300 font-mono mb-6">
                ⛓️ Ranked match — stats saved on-chain
                {matchResult.onChainHash && (
                  <div className="mt-1 text-[10px] text-slate-500 truncate">
                    {matchResult.onChainHash}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg bg-amber-950/30 border border-amber-500/20 p-3 text-xs text-amber-300 font-mono mb-6">
                Connect your wallet to save progress and play ranked matches
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={requestRematch}
                className={`flex-1 py-3 rounded-xl border text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 ${
                  rematchRequested
                    ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300 animate-pulse"
                    : "border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/20"
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                {rematchRequested ? "Accept Rematch" : "Request Rematch"}
              </button>
              <button
                onClick={handleLeave}
                className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 text-xs font-bold tracking-widest uppercase hover:bg-slate-800/40 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> Lobby
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Active game screen 

  return (
    <div className="min-h-screen bg-[#0d111a] flex flex-col p-4 sm:p-6">
      {/* Arena card */}
      <div className="w-full max-w-2xl mx-auto rounded-xl border border-slate-800 bg-[#0d111a]/80 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

        <h2 className="text-center text-xs font-bold tracking-[0.3em] uppercase text-slate-400 font-mono mb-6">
          Live Match
          {isRanked && <span className="ml-2 text-indigo-400">⚡ Ranked</span>}
        </h2>

        {/* Players VS */}
        <div className="flex items-center justify-around mb-8 select-none">
          {/* Me */}
          <div className="text-center space-y-2">
            <div className="h-20 w-20 rounded-xl bg-slate-900 border border-indigo-500/40 flex items-center justify-center shadow-lg shadow-indigo-500/5 text-3xl">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span>{user.username[0].toUpperCase()}</span>
              )}
            </div>
            <div className="font-mono text-xs font-bold text-slate-300 uppercase">
              {user.username}
            </div>
            <div className="text-[10px] text-indigo-400 font-bold tracking-wider">
              {user.points.toLocaleString()} PTS
            </div>
          </div>

          {/* Center */}
          <div className="text-center space-y-1">
            {/* Score */}
            <div className="text-2xl font-black font-mono text-white">
              <span className="text-indigo-400">{myWins}</span>
              <span className="text-slate-600 mx-1">–</span>
              <span className="text-rose-400">{opponentWins}</span>
            </div>
            <div className="rounded-full bg-slate-900 border border-slate-800 px-3 py-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Round {currentRound}
            </div>
            {/* Timer */}
            {phase === "selecting" && (
              <div
                className={`text-xs font-mono font-medium pt-1 ${
                  timeLeft <= 5
                    ? "text-rose-400 animate-pulse"
                    : "text-amber-400/90"
                }`}
              >
                ⏱️ 00:{String(timeLeft).padStart(2, "0")}
              </div>
            )}
          </div>

          {/* Opponent */}
          <div className="text-center space-y-2">
            <div className="h-20 w-20 rounded-xl bg-slate-900 border border-red-500/40 flex items-center justify-center shadow-lg shadow-red-500/5 text-3xl">
              🥷
            </div>
            <div className="font-mono text-xs font-bold text-slate-300 uppercase">
              {opponent?.username ?? "Opponent"}
            </div>
            <div className="text-[10px] text-slate-500 font-bold tracking-wider">
              {opponentMoved ? "✓ MOVED" : "..."}
            </div>
          </div>
        </div>

        {/* Round result reveal */}
        <AnimatePresence>
          {phase === "reveal" && roundResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-xl bg-slate-900/60 border border-slate-800 p-4 text-center"
            >
              <div className="flex items-center justify-center gap-8 text-4xl mb-3">
                <span>{MOVE_EMOJI[roundResult.player1Move]}</span>
                <span className="text-xl font-black text-slate-600">vs</span>
                <span>{MOVE_EMOJI[roundResult.player2Move]}</span>
              </div>
              <div
                className={`text-xs font-black font-mono uppercase tracking-widest ${
                  roundResult.roundWinnerId === user.id
                    ? "text-indigo-400"
                    : roundResult.roundWinnerId === null
                      ? "text-amber-400"
                      : "text-rose-400"
                }`}
              >
                {roundResult.roundWinnerId === user.id
                  ? "You win this round!"
                  : roundResult.roundWinnerId === null
                    ? "Draw!"
                    : `${opponent?.username ?? "Opponent"} wins this round`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Move selection — image buttons from MatchArena UI */}
        {phase === "selecting" && (
          <>
            <div className="max-w-md mx-auto grid grid-cols-3 gap-4">
              {MOVE_ACTIONS.map((act) => (
                <button
                  key={act.name}
                  onClick={() => submitMove(act.name)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 hover:bg-indigo-950/20 hover:border-indigo-500/60 transition-all group active:scale-95"
                >
                  <div className="relative w-24 h-24 mb-3 transform group-hover:scale-110 transition-transform">
                    <Image
                      src={act.src}
                      alt={act.label}
                      fill
                      className="object-contain"
                      priority
                      sizes="96px"
                    />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                    {act.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-4">
              Choose Your Move
            </p>
          </>
        )}

        {/* Waiting state */}
        {phase === "waiting" && (
          <div className="text-center py-8 space-y-4">
            <div className="text-6xl">{myMove ? MOVE_EMOJI[myMove] : "?"}</div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">
              {opponentMoved
                ? "Both ready — calculating result..."
                : "Waiting for opponent..."}
            </p>
          </div>
        )}
      </div>

      {/* Leave */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleLeave}
          className="text-[10px] font-mono text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors"
        >
          Leave Match
        </button>
      </div>
    </div>
  );
}
