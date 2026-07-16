"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Shield } from "lucide-react";
import { useGameStore, Move } from "@/features/game/store/game.store";
import { useGameSocket } from "@/features/game/hooks/useGameSocket";
import { useSocketStore } from "@/features/game/store/socket.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useMatchmaking } from "@/features/game/hooks/useMatchmaking";
import LiveChatPanel from "@/features/leaderboard/LiveChatPanel";
import { useSquadStore } from "@/features/friends/store/squad.store";
// Timer hooks

function useRoundTimer(active: boolean, seconds = 30) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(seconds);
    if (!active) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [active, seconds]);

  return timeLeft;
}

function useQueueTimer(active: boolean) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const format = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return format(elapsed);
}

export default function MatchArena() {
  const { user } = useAuthStore();
  const { squad } = useSquadStore();   // For squad check

  const {
    roomId,
    matchId,
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
    isSpectating,
    player1,
    player2,
    initGame,
    resetGame,
  } = useGameStore();

  const { matchData, resetMatchmaking } = useSocketStore();
  const { isQueued, queuePosition, joinQueue, cancelQueue } = useMatchmaking();
  const { submitMove, requestRematch } = useGameSocket(roomId ?? "");

  const timeLeft = useRoundTimer(phase === "selecting" && !isSpectating, 30);
  const queueTimer = useQueueTimer(isQueued);

  useEffect(() => {
    if (matchData && matchData.matchId !== matchId) {
      initGame(matchData);
    }
  }, [initGame, matchData, matchId]);

  const MOVE_ACTIONS: { name: Move; label: string; src: string }[] = [
    { name: "rock", label: "Rock", src: "/rock-icon.png" },
    { name: "paper", label: "Paper", src: "/paper-icon.png" },
    { name: "scissors", label: "Scissors", src: "/scissors-icon.png" },
  ];

  const MOVE_ICON: Record<Move, string> = {
    rock: "/rock-icon.png",
    paper: "/paper-icon.png",
    scissors: "/scissors-icon.png",
  };

  // Matchmaking / Idle Menu 
  if (!matchId) {
    return (
      <div className="relative flex min-h-[260px] w-full flex-col justify-center overflow-hidden rounded-xl border border-slate-800 bg-[#0d111a]/80 p-4 text-center shadow-xl sm:min-h-[300px] sm:p-6">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
        
        <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-slate-400 font-mono mb-6">
          BATTLE ARENA
        </h2>

        {isQueued ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-mono text-cyan-300 uppercase tracking-widest animate-pulse">
                Looking for Opponent...
              </p>
              <p className="text-xs font-mono text-slate-500">
                Queue Position: {queuePosition} · Elapsed: {queueTimer}
              </p>
            </div>
            <button
              onClick={cancelQueue}
              className="mx-auto w-full max-w-xs rounded-xl border border-rose-500/30 px-6 py-3 text-xs font-bold uppercase tracking-widest text-rose-400 transition-all hover:border-rose-500/50 hover:bg-rose-950/20 font-mono select-none"
            >
              Cancel Matchmaking
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="max-w-xs mx-auto">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-6">
                Connect your wallet to earn points and climb the global leaderboards.
              </p>
              <button
                onClick={joinQueue}
                className="w-full rounded-xl bg-[#A5C3F9] px-6 py-4 text-xs font-black uppercase tracking-widest text-[#0A0F1D] shadow-[0_0_20px_rgba(165,195,249,0.15)] transition-all hover:bg-[#B7D2FC] active:scale-95 font-mono select-none"
              >
                Find Combat Match
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Finished Match Result Screen ──
  if (phase === "finished" && matchResult) {
    const iWon = isSpectating ? false : matchResult.winnerId === user?.id;
    const isDraw = matchResult.winnerId === null;
    
    const player1Won = matchResult.winnerId === player1?.userId;
    const handleLeave = () => {
      resetGame();
      resetMatchmaking();
    };

    return (
      <div className="relative flex min-h-[260px] w-full flex-col justify-center overflow-hidden rounded-xl border border-slate-800 bg-[#0d111a]/80 p-4 text-center shadow-xl sm:min-h-[300px] sm:p-6">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
        
        <div className={`text-6xl mb-4 ${iWon || (isSpectating && !isDraw) ? "animate-bounce" : ""}`}>
          {isDraw ? "🤝" : (isSpectating ? (player1Won ? "🏆" : "🏆") : (iWon ? "🏆" : "💀"))}
        </div>

        <h1
          className={`text-2xl font-black font-mono uppercase tracking-widest mb-2 ${
            isDraw
              ? "text-amber-400"
              : (isSpectating 
                  ? "text-indigo-400" 
                  : (iWon ? "text-indigo-400" : "text-rose-400"))
          }`}
        >
          {isSpectating 
            ? (isDraw ? "Battle Drawn!" : `${player1Won ? player1?.username : player2?.username} Wins!`)
            : (isDraw ? "Draw!" : iWon ? "VICTORY!" : "DEFEAT")}
        </h1>

        {/* Enhanced Match Result UI */}
        {!isSpectating && iWon && (
          <div className="mx-auto w-full max-w-sm mb-6 border border-slate-800 rounded-lg p-4 bg-slate-900/50">
            {isRanked ? (
              <div className="space-y-2 text-sm font-mono text-left">
                <div className="flex justify-between text-slate-300">
                  <span>Match Points:</span>
                  <span className="text-emerald-400 font-bold">+10</span>
                </div>
                {/* Note: Badge bonus and total earned would be dynamic based on notification:live event in a full implementation */}
                <div className="flex justify-between text-slate-300 border-b border-slate-800 pb-2">
                  <span>Total Earned:</span>
                  <span className="text-emerald-400 font-bold">+10</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-2 text-xs">
                  <span>New Balance:</span>
                  <span>{user?.points ? user.points + 10 : 10} pts</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Current Streak:</span>
                  <span className="text-cyan-400">{user?.currentStreak ? user.currentStreak + 1 : 1} wins</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm font-mono text-center">
                <div className="text-amber-400 flex items-center justify-center gap-2 font-bold mb-2">
                  <span>⚠️</span> Unranked Match
                </div>
                <div className="text-slate-400 text-xs text-left space-y-1">
                  <p>Connect your wallet to:</p>
                  <ul className="list-disc list-inside pl-2">
                    <li>Save your progress</li>
                    <li>Earn points & badges</li>
                    <li>Appear on leaderboard</li>
                  </ul>
                </div>
                <button
                  className="mt-4 w-full rounded bg-indigo-500/20 border border-indigo-500/50 py-2 text-indigo-300 hover:bg-indigo-500/30 transition-colors uppercase tracking-widest text-xs font-bold"
                  onClick={() => alert("Wallet connect modal would open here")}
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        )}

        {/* Score */}
        <div className="flex justify-center gap-12 mb-6 select-none">
          <div className="text-center">
            <div className="text-3xl font-black font-mono text-indigo-400">
              {matchResult.player1Wins}
            </div>
            <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mt-1 truncate max-w-[80px] mx-auto">
              {isSpectating ? player1?.username : user?.username}
            </div>
          </div>
          <div className="text-slate-600 text-xl font-black font-mono self-center">
            vs
          </div>
          <div className="text-center">
            <div className="text-3xl font-black font-mono text-rose-400">
              {matchResult.player2Wins}
            </div>
            <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mt-1 truncate max-w-[80px] mx-auto">
              {isSpectating ? player2?.username : opponent?.username ?? "Opponent"}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xs">
          {isSpectating && !isDraw && (
            <button
              onClick={() => {
                resetGame();
                resetMatchmaking();
                joinQueue();
              }}
              className="mb-3 w-full py-3 rounded-xl bg-[#A5C3F9] text-[#0A0F1D] text-xs font-black tracking-widest uppercase hover:bg-[#B7D2FC] transition-colors"
            >
              Challenge Winner
            </button>
          )}
          {!isSpectating && (
            <button
              onClick={requestRematch}
              className={`mb-3 w-full py-3 rounded-xl border text-xs font-black tracking-widest uppercase transition-colors ${
                rematchRequested
                  ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300 animate-pulse"
                  : "border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/20"
              }`}
            >
              {rematchRequested ? "Accept Rematch" : "Request Rematch"}
            </button>
          )}
          <button
            onClick={handleLeave}
            className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 text-xs font-bold tracking-widest uppercase hover:bg-slate-800/40 transition-colors flex items-center justify-center gap-2"
          >
            Leave Battle
          </button>
        </div>
      </div>
    );
  }

  // ── Active Combat Arena Screen ──
  return (
      <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-[#0d111a]/80 p-4 shadow-xl sm:p-5 lg:p-6">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

      <h2 className="mb-5 flex flex-wrap items-center justify-center gap-1.5 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 font-mono sm:mb-6 sm:text-xs sm:tracking-[0.3em]">
        {isSpectating ? (
          <>
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span>SPECTATING BATTLE</span>
          </>
        ) : (
          <span>LIVE BATTLE</span>
        )}
        {isRanked && <span className="text-indigo-400 ml-1.5">⚡ Ranked</span>}
      </h2>

      {/* Players VS */}
      <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 select-none sm:mb-8 sm:gap-5">
        {/* Left Side: Me or Player 1 */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-indigo-500/40 bg-slate-900 text-xl shadow-lg shadow-indigo-500/5 sm:h-16 sm:w-16 sm:text-2xl">
            {isSpectating ? (
              <span>{player1?.username[0]?.toUpperCase() ?? "?"}</span>
            ) : (
              user?.avatar ? (
                <img src={user.avatar} alt="me" className="w-full h-full object-cover" />
              ) : (
                <span>{user?.username[0].toUpperCase()}</span>
              )
            )}
          </div>
          <div className="mx-auto max-w-[76px] truncate font-mono text-[9px] font-bold uppercase text-slate-300 sm:max-w-[90px] sm:text-[10px]">
            {isSpectating ? player1?.username : user?.username}
          </div>
          <div className="text-[8px] font-bold tracking-wider text-indigo-400">
            {isSpectating ? "PLAYER 1" : `${user?.points.toLocaleString()} PTS`}
          </div>
        </div>

        {/* Center: Scores and Info */}
        <div className="text-center space-y-1">
          <div className="text-lg font-black font-mono text-white sm:text-xl">
            <span className="text-indigo-400">{myWins}</span>
            <span className="text-slate-600 mx-1">–</span>
            <span className="text-rose-400">{opponentWins}</span>
          </div>
          <div className="rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400">
            Round {currentRound}
          </div>
          {phase === "selecting" && !isSpectating && (
            <div className={`text-[10px] font-mono font-medium pt-1 ${timeLeft <= 5 ? "text-rose-400 animate-pulse" : "text-amber-400/90"}`}>
              00:{String(timeLeft).padStart(2, "0")}
            </div>
          )}
        </div>

        {/* Right Side: Opponent or Player 2 */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-rose-500/40 bg-slate-900 text-xl shadow-lg shadow-red-500/5 sm:h-16 sm:w-16 sm:text-2xl">
            {isSpectating ? (
              <span>{player2?.username[0]?.toUpperCase() ?? "🥷"}</span>
            ) : (
              "🥷"
            )}
          </div>
          <div className="mx-auto max-w-[76px] truncate font-mono text-[9px] font-bold uppercase text-slate-300 sm:max-w-[90px] sm:text-[10px]">
            {isSpectating ? player2?.username : opponent?.username ?? "Opponent"}
          </div>
          <div className="text-[8px] text-slate-500 font-bold tracking-wider">
            {isSpectating ? "PLAYER 2" : (opponentMoved ? "✓ MOVED" : "...")}
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
            className="mb-5 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center animate-fade-in sm:mb-6 sm:p-4"
          >
            <div className="mb-3 flex items-center justify-center gap-4 sm:gap-8">
              <div className="relative h-12 w-12 sm:h-16 sm:w-16">
                <Image src={MOVE_ICON[roundResult.player1Move]} alt={roundResult.player1Move} fill className="object-contain" sizes="64px" />
              </div>
              <span className="text-sm font-black text-slate-600 sm:text-base">vs</span>
              <div className="relative h-12 w-12 sm:h-16 sm:w-16">
                <Image src={MOVE_ICON[roundResult.player2Move]} alt={roundResult.player2Move} fill className="object-contain" sizes="64px" />
              </div>
            </div>
            <div
              className={`text-[10px] font-black font-mono uppercase tracking-widest ${
                isSpectating
                  ? "text-amber-400"
                  : (roundResult.roundWinnerId === user?.id
                      ? "text-indigo-400"
                      : roundResult.roundWinnerId === null
                        ? "text-amber-400"
                        : "text-rose-400")
              }`}
            >
              {isSpectating 
                ? (roundResult.roundWinnerId === null 
                    ? "Draw!" 
                    : `${roundResult.roundWinnerId === player1?.userId ? player1?.username : player2?.username} wins round`)
                : (roundResult.roundWinnerId === user?.id
                    ? "You win this round!"
                    : roundResult.roundWinnerId === null
                      ? "Draw!"
                      : `${opponent?.username ?? "Opponent"} wins this round`)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Selection or Waiting */}
      {isSpectating ? (
        <div className="text-center py-6 border-t border-slate-800">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">
            {phase === "selecting"
              ? "Match in Progress · Players selecting moves..."
              : "Round Resolved · Displaying outcome"}
          </p>
          <button
            onClick={() => {
              resetGame();
              resetMatchmaking();
            }}
            className="mt-4 text-[9px] font-mono text-slate-500 hover:text-slate-300 uppercase tracking-wider transition-colors border border-slate-800 px-3 py-1.5 rounded-lg hover:border-slate-700"
          >
            Stop Spectating
          </button>
        </div>
      ) : phase === "selecting" ? (
        <>
          <div className="mx-auto grid max-w-md grid-cols-3 gap-2.5 sm:gap-4">
            {MOVE_ACTIONS.map((act) => (
              <button
                key={act.name}
                onClick={() => submitMove(act.name)}
                className="group flex flex-col items-center justify-center rounded-xl border border-slate-800 p-2.5 transition-all hover:border-indigo-500/60 hover:bg-indigo-950/20 active:scale-95 sm:p-3"
              >
                <div className="relative mb-2 h-12 w-12 transform transition-transform group-hover:scale-110 sm:h-16 sm:w-16">
                  <Image
                    src={act.src}
                    alt={act.label}
                    fill
                    className="object-contain"
                    priority
                    sizes="64px"
                  />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400 transition-colors group-hover:text-slate-200 sm:text-[9px] sm:tracking-widest">
                  {act.label}
                </span>
              </button>
            ))}
          </div>
          <p className="text-center text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-4">
            Choose Your Move
          </p>
        </>
      ) : (
        <div className="text-center py-6 space-y-3">
          {myMove ? (
            <div className="relative w-20 h-20 mx-auto">
              <Image src={MOVE_ICON[myMove]} alt={myMove} fill className="object-contain" sizes="80px" />
            </div>
          ) : (
            <div className="text-4xl text-slate-600">?</div>
          )}
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">
            {opponentMoved ? "Both ready · resolving outcome..." : "Waiting for opponent..."}
          </p>
        </div>
      )}
      {/* Chat Sidebar - Only if user has a squad */}
      <div className="mt-5 sm:mt-6">
        {squad ? (
          <LiveChatPanel title={isSpectating ? "Squad Watch Chat" : "Squad Battle Chat"} />
        ) : (
          <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#0d111a]/80 p-6 text-center sm:p-8">
            <Shield className="w-12 h-12 text-slate-600 mb-4" />
            <p className="text-slate-400">Squad Chat Unavailable</p>
            <p className="text-[10px] text-slate-600 mt-2">Join or create a squad to chat during matches</p>
          </div>
        )}
      </div>
    </div>
  );
}
