import { Match } from "@/shared/types";
import apiClient from "@/shared/lib/axios";

type UnknownRecord = Record<string, unknown>;

export interface ReplayPlayer {
  userId: string | null;
  username: string;
  avatar: string | null;
}

export interface ReplayRound {
  roundNumber: number;
  player1Move: string | null;
  player2Move: string | null;
  winnerId: string | null;
}

export interface ReplayMatch {
  id: string;
  matchId: string;
  isRanked: boolean;
  createdAt: string;
  endedAt: string | null;
  winnerId: string | null;
  player1Wins: number;
  player2Wins: number;
  onChainHash: string | null;
  explorerUrl: string | null;
  player1: ReplayPlayer;
  player2: ReplayPlayer;
  rounds: ReplayRound[];
}

export interface ReplayHistoryEntry {
  id: string;
  matchId: string;
  status: "VICTORY" | "DEFEAT" | "DRAW";
  opponent: ReplayPlayer;
  score: string;
  rewardRP: number;
  rewardRPS: number;
  pointsDelta: number;
  txHash: string | null;
  explorerUrl: string | null;
  createdAt: string;
  timestampLabel: string;
  isRanked: boolean;
  player1Wins: number;
  player2Wins: number;
}

function unwrapApiData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" ? (value as UnknownRecord) : null;
}

function pickString(record: UnknownRecord | null, keys: string[]): string | null {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function pickNumber(record: UnknownRecord | null, keys: string[]): number | null {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function pickBoolean(record: UnknownRecord | null, keys: string[]): boolean | null {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
  }
  return null;
}

function formatMatchTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString();
}

function normalizePlayer(raw: unknown, fallbackLabel: string): ReplayPlayer {
  const record = asRecord(raw);
  return {
    userId: pickString(record, ["userId", "id", "playerId"]),
    username: pickString(record, ["username", "name"]) ?? fallbackLabel,
    avatar: pickString(record, ["avatar", "avatarUrl", "image"]),
  };
}

function parseScore(score: string | null): { player1Wins: number; player2Wins: number } {
  if (!score) return { player1Wins: 0, player2Wins: 0 };
  const parts = score
    .split(/[-:]/)
    .map((part) => Number(part.trim()))
    .filter((value) => !Number.isNaN(value));

  return {
    player1Wins: parts[0] ?? 0,
    player2Wins: parts[1] ?? 0,
  };
}

function normalizeReplayMatch(raw: unknown): ReplayMatch {
  const record = asRecord(raw);
  const players = Array.isArray(record?.players) ? record.players : [];
  const player1 = normalizePlayer(
    record?.player1 ?? record?.firstPlayer ?? players[0],
    "Player 1",
  );
  const player2 = normalizePlayer(
    record?.player2 ?? record?.secondPlayer ?? players[1],
    "Player 2",
  );
  const directScore = pickString(record, ["score", "finalScore"]);
  const parsedScore = parseScore(directScore);
  const player1Wins =
    pickNumber(record, ["player1Wins", "firstPlayerWins", "homeWins"]) ??
    parsedScore.player1Wins;
  const player2Wins =
    pickNumber(record, ["player2Wins", "secondPlayerWins", "awayWins"]) ??
    parsedScore.player2Wins;

  const rounds = Array.isArray(record?.rounds)
    ? record.rounds.map((round, index) => {
        const roundRecord = asRecord(round);
        return {
          roundNumber:
            pickNumber(roundRecord, ["roundNumber", "round", "index"]) ?? index + 1,
          player1Move: pickString(roundRecord, ["player1Move", "move1", "firstMove"]),
          player2Move: pickString(roundRecord, ["player2Move", "move2", "secondMove"]),
          winnerId: pickString(roundRecord, ["winnerId", "roundWinnerId"]),
        };
      })
    : [];

  const id =
    pickString(record, ["matchId", "id", "roomId"]) ??
    `${player1.username}-${player2.username}-${pickString(record, ["createdAt"]) ?? Date.now()}`;

  return {
    id,
    matchId: id,
    isRanked: pickBoolean(record, ["isRanked", "ranked"]) ?? true,
    createdAt:
      pickString(record, ["createdAt", "playedAt", "endedAt", "updatedAt"]) ??
      new Date().toISOString(),
    endedAt: pickString(record, ["endedAt", "updatedAt"]),
    winnerId: pickString(record, ["winnerId"]),
    player1Wins,
    player2Wins,
    onChainHash: pickString(record, ["onChainHash", "txHash", "transactionHash"]),
    explorerUrl: pickString(record, ["explorerUrl", "blockExplorerUrl"]),
    player1,
    player2,
    rounds,
  };
}

function normalizeHistoryEntry(raw: unknown, subjectUserId?: string): ReplayHistoryEntry {
  const match = normalizeReplayMatch(raw);
  const record = asRecord(raw);
  const fallbackStatus = pickString(record, ["result", "status", "outcome"]);

  const status =
    fallbackStatus === "DRAW"
      ? "DRAW"
      : subjectUserId && match.winnerId
        ? match.winnerId === subjectUserId
          ? "VICTORY"
          : "DEFEAT"
        : fallbackStatus === "VICTORY" || fallbackStatus === "DEFEAT"
          ? fallbackStatus
          : match.winnerId
            ? "DEFEAT"
            : "DRAW";

  const opponent =
    subjectUserId && match.player1.userId === subjectUserId
      ? match.player2
      : subjectUserId && match.player2.userId === subjectUserId
        ? match.player1
        : normalizePlayer(
            record?.opponent ??
              (record?.opponentUsername
                ? { username: record.opponentUsername, userId: record?.opponentId }
                : match.player2),
            "Opponent",
          );

  const directScore = pickString(record, ["score", "finalScore"]);
  const score = directScore ?? `${match.player1Wins} - ${match.player2Wins}`;
  const pointsDelta =
    pickNumber(record, ["pointsDelta", "rpChange", "pointsChange", "ratingDelta"]) ??
    (status === "VICTORY" ? Math.max(match.player1Wins, match.player2Wins) * 10 : 0);
  const rewardRPS =
    pickNumber(record, ["rewardRPS", "tokenReward", "rpsReward"]) ??
    (status === "VICTORY" ? Math.max(match.player1Wins, match.player2Wins) * 5 : 0);

  return {
    id: match.id,
    matchId: match.matchId,
    status,
    opponent,
    score,
    rewardRP: pointsDelta,
    rewardRPS,
    pointsDelta,
    txHash: match.onChainHash,
    explorerUrl: match.explorerUrl,
    createdAt: match.createdAt,
    timestampLabel: formatMatchTimestamp(match.createdAt),
    isRanked: match.isRanked,
    player1Wins: match.player1Wins,
    player2Wins: match.player2Wins,
  };
}

export function replayHistoryEntryToMatch(entry: ReplayHistoryEntry): Match {
  return {
    id: entry.matchId,
    matchId: entry.matchId,
    status: entry.status,
    opponent: entry.opponent.username,
    opponentId: entry.opponent.userId ?? undefined,
    opponentLevel: 0,
    score: entry.score,
    rewardRP: entry.rewardRP,
    rewardRPS: entry.rewardRPS,
    txId: entry.txHash ?? "Pending verification",
    timestamp: entry.timestampLabel,
    createdAt: entry.createdAt,
    onChainHash: entry.txHash,
    explorerUrl: entry.explorerUrl,
    isRanked: entry.isRanked,
    player1Wins: entry.player1Wins,
    player2Wins: entry.player2Wins,
  };
}

export async function getMyReplayHistory(
  limit = 10,
  offset = 0,
  subjectUserId?: string,
): Promise<ReplayHistoryEntry[]> {
  const { data } = await apiClient.get("/replay/history/me", {
    params: { limit, offset },
  });
  const items = unwrapApiData<unknown[]>(data);
  return Array.isArray(items)
    ? items.map((item) => normalizeHistoryEntry(item, subjectUserId))
    : [];
}

export async function getUserReplayHistory(
  userId: string,
  limit = 10,
  offset = 0,
): Promise<ReplayHistoryEntry[]> {
  const { data } = await apiClient.get(`/replay/history/${userId}`, {
    params: { limit, offset },
  });
  const items = unwrapApiData<unknown[]>(data);
  return Array.isArray(items)
    ? items.map((item) => normalizeHistoryEntry(item, userId))
    : [];
}

export async function getReplay(matchId: string): Promise<ReplayMatch> {
  const { data } = await apiClient.get(`/replay/${matchId}`);
  return normalizeReplayMatch(unwrapApiData<unknown>(data));
}
