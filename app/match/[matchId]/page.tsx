"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Trophy, Swords, RotateCcw, Home } from "lucide-react";
import { useGameStore, Move } from "@/features/game/store/game.store";
import { useGameSocket } from "@/features/game/hooks/useGameSocket";
import { useSocketStore } from "@/features/game/store/socket.store";
import { useAuthStore } from "@/features/auth/store/auth.store";

const MOVES: { value: Move; label: string; emoji: string; beats: Move }[] = [
  { value: "rock", label: "Rock", emoji: "🪨", beats: "scissors" },
  { value: "paper", label: "Paper", emoji: "📄", beats: "rock" },
  { value: "scissors", label: "Scissors", emoji: "✂️", beats: "paper" },
];

const MOVE_EMOJI: Record<Move, string> = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

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
    myWins,
    opponentWins,
    opponent,
    isRanked,
    initGame,
    resetGame,
  } = useGameStore();
  const { submitMove, requestRematch } = useGameSocket(roomId ?? "");

  // Init game from matchmaking data
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

  // ── Match result screen ──────────────────────────────────────
  if (phase === "finished" && matchResult) {
    const iWon = matchResult.winnerId === user.id;
    const isDraw = matchResult.winnerId === null;

    return (
      <div className="min-h-screen bg-[#070A13] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center space-y-6"
        >
          <div className={`text-8xl ${iWon ? "animate-bounce" : ""}`}>
            {isDraw ? "🤝" : iWon ? "🏆" : "💀"}
          </div>
          <h1
            className={`text-4xl font-black font-mono uppercase tracking-widest ${
              iWon
                ? "text-cyan-400"
                : isDraw
                  ? "text-yellow-400"
                  : "text-rose-400"
            }`}
          >
            {isDraw ? "Draw!" : iWon ? "Victory!" : "Defeat"}
          </h1>
          <div className="flex justify-center gap-8 text-white font-mono">
            <div>
              <div className="text-3xl font-black">
                {matchResult.player1Wins}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                You
              </div>
            </div>
            <div className="text-gray-600 text-2xl font-black">vs</div>
            <div>
              <div className="text-3xl font-black">
                {matchResult.player2Wins}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                {opponent?.username ?? "Opponent"}
              </div>
            </div>
          </div>

          {matchResult.isRanked ? (
            <div className="rounded-xl bg-cyan-950/30 border border-cyan-500/20 p-4 text-xs text-cyan-300 font-mono">
              ⛓️ Ranked match — stats saved on-chain
              {matchResult.onChainHash && (
                <div className="mt-1 text-gray-500 truncate">
                  {matchResult.onChainHash}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-amber-950/30 border border-amber-500/20 p-4 text-xs text-amber-300 font-mono">
              Connect your wallet to save progress and play ranked matches
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={requestRematch}
              className="flex-1 py-3 rounded-xl border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-widest uppercase hover:bg-cyan-500/10 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Rematch
            </button>
            <button
              onClick={handleLeave}
              className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 text-xs font-bold tracking-widest uppercase hover:bg-gray-800/40 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> Lobby
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Main game screen ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070A13] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#141C2F]">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="font-mono font-bold text-sm uppercase tracking-wider text-white">
            {user.username}
          </span>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            Round
          </div>
          <div className="text-xl font-black font-mono text-white">
            {currentRound}
          </div>
          <div
            className={`text-[10px] font-mono uppercase tracking-widest ${isRanked ? "text-cyan-400" : "text-amber-400"}`}
          >
            {isRanked ? "⚡ Ranked" : "Unranked"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm uppercase tracking-wider text-white">
            {opponent?.username ?? "Opponent"}
          </span>
          <Swords className="w-5 h-5 text-rose-400" />
        </div>
      </div>

      {/* Score */}
      <div className="flex justify-center gap-12 py-4">
        <div className="text-center">
          <div className="text-4xl font-black font-mono text-cyan-400">
            {myWins}
          </div>
          <div className="text-[10px] text-gray-500 font-mono uppercase">
            You
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black font-mono text-rose-400">
            {opponentWins}
          </div>
          <div className="text-[10px] text-gray-500 font-mono uppercase">
            {opponent?.username ?? "Opponent"}
          </div>
        </div>
      </div>

      {/* Round result reveal */}
      <AnimatePresence>
        {phase === "reveal" && roundResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-6 rounded-2xl border border-slate-800 bg-[#0C1220]/80 p-6 text-center"
          >
            <div className="flex items-center justify-center gap-8 text-5xl mb-4">
              <span>{MOVE_EMOJI[roundResult.player1Move]}</span>
              <span className="text-2xl font-black text-gray-500">vs</span>
              <span>{MOVE_EMOJI[roundResult.player2Move]}</span>
            </div>
            <div
              className={`text-sm font-black font-mono uppercase tracking-widest ${
                roundResult.roundWinnerId === user.id
                  ? "text-cyan-400"
                  : roundResult.roundWinnerId === null
                    ? "text-yellow-400"
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

      {/* Move selection */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {phase === "selecting" && (
          <>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
              Choose your move
            </p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
              {MOVES.map((m) => (
                <motion.button
                  key={m.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => submitMove(m.value)}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-slate-800 bg-[#0C1220]/60 hover:border-cyan-500/50 hover:bg-[#101726] transition-all"
                >
                  <span className="text-4xl">{m.emoji}</span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    {m.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {phase === "waiting" && (
          <div className="text-center space-y-4">
            <div className="text-5xl">{myMove ? MOVE_EMOJI[myMove] : "?"}</div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest animate-pulse">
              {opponentMoved
                ? "Both ready — calculating result..."
                : "Waiting for opponent..."}
            </p>
          </div>
        )}
      </div>

      {/* Leave button */}
      <div className="p-4 flex justify-center">
        <button
          onClick={handleLeave}
          className="text-[10px] font-mono text-gray-600 hover:text-gray-400 uppercase tracking-widest transition-colors"
        >
          Leave Match
        </button>
      </div>
    </div>
  );
}
