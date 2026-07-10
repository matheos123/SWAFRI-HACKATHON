import { create } from "zustand";

export type Move = "rock" | "paper" | "scissors";
export type GamePhase =
  | "waiting" // waiting for opponent to move
  | "selecting" // player choosing move
  | "reveal" // showing round result
  | "finished"; // match over

export interface RoundResult {
  roundNumber: number;
  player1Move: Move;
  player2Move: Move;
  roundWinnerId: string | null; // null = draw
  player1Wins: number;
  player2Wins: number;
}

export interface MatchResult {
  winnerId: string | null;
  player1Wins: number;
  player2Wins: number;
  matchId: string;
  onChainHash: string | null;
  isRanked: boolean;
}

interface GameState {
  roomId: string | null;
  matchId: string | null;
  isRanked: boolean;
  opponent: { userId: string; username: string } | null;

  phase: GamePhase;
  currentRound: number;
  myMove: Move | null;
  opponentMoved: boolean;
  roundResult: RoundResult | null;
  matchResult: MatchResult | null;

  myWins: number;
  opponentWins: number;

  // Spectator mode support
  isSpectating: boolean;
  player1: { userId: string; username: string } | null;
  player2: { userId: string; username: string } | null;

  // Actions
  initGame: (data: {
    roomId: string;
    matchId: string;
    isRanked: boolean;
    opponent: { userId: string; username: string };
  }) => void;
  initSpectate: (data: {
    roomId: string;
    matchId?: string;
    isRanked: boolean;
    player1: { userId: string; username: string };
    player2: { userId: string; username: string };
    currentRound: number;
    player1Wins: number;
    player2Wins: number;
  }) => void;
  setMyMove: (move: Move) => void;
  setOpponentMoved: () => void;
  setRoundResult: (result: RoundResult) => void;
  nextRound: (roundNumber: number) => void;
  setMatchResult: (result: MatchResult) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  roomId: null,
  matchId: null,
  isRanked: false,
  opponent: null,

  phase: "selecting",
  currentRound: 1,
  myMove: null,
  opponentMoved: false,
  roundResult: null,
  matchResult: null,

  myWins: 0,
  opponentWins: 0,

  isSpectating: false,
  player1: null,
  player2: null,

  initGame: (data) =>
    set({
      roomId: data.roomId,
      matchId: data.matchId,
      isRanked: data.isRanked,
      opponent: data.opponent,
      phase: "selecting",
      currentRound: 1,
      myMove: null,
      opponentMoved: false,
      roundResult: null,
      matchResult: null,
      myWins: 0,
      opponentWins: 0,
      isSpectating: false,
      player1: null,
      player2: null,
    }),

  initSpectate: (data) =>
    set({
      roomId: data.roomId,
      matchId: data.matchId ?? null,
      isRanked: data.isRanked,
      player1: data.player1,
      player2: data.player2,
      opponent: data.player2,
      phase: "reveal",
      currentRound: data.currentRound,
      myWins: data.player1Wins,
      opponentWins: data.player2Wins,
      myMove: null,
      opponentMoved: false,
      roundResult: null,
      matchResult: null,
      isSpectating: true,
    }),

  setMyMove: (move) => set({ myMove: move, phase: "waiting" }),
  setOpponentMoved: () => set({ opponentMoved: true }),

  setRoundResult: (result) =>
    set((state) => ({
      roundResult: result,
      phase: "reveal",
      myWins: result.player1Wins,
      opponentWins: result.player2Wins,
    })),

  nextRound: (roundNumber) =>
    set({
      currentRound: roundNumber,
      phase: "selecting",
      myMove: null,
      opponentMoved: false,
      roundResult: null,
    }),

  setMatchResult: (result) => set({ matchResult: result, phase: "finished" }),

  resetGame: () =>
    set({
      roomId: null,
      matchId: null,
      isRanked: false,
      opponent: null,
      phase: "selecting",
      currentRound: 1,
      myMove: null,
      opponentMoved: false,
      roundResult: null,
      matchResult: null,
      myWins: 0,
      opponentWins: 0,
      isSpectating: false,
      player1: null,
      player2: null,
    }),
}));
