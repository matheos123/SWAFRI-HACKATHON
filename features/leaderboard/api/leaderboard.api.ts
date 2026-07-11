import apiClient from "@/shared/lib/axios";

export interface LeaderboardPlayer {
  rank: number;
  userId: string;
  username: string;
  avatar: string | null;
  walletAddress: string | null;
  blockchainProfileId: string | null;
  wins: number;
  losses: number;
  totalMatches: number;
  points: number;
  currentStreak: number;
  longestStreak: number;
  winRate: number;
}

export interface MyRank {
  rank: number;
  points: number;
  totalRankedPlayers: number;
}

export async function getLeaderboard(
  limit = 50,
  offset = 0,
): Promise<LeaderboardPlayer[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: LeaderboardPlayer[];
  }>("/leaderboard", { params: { limit, offset } });
  return data.data;
}

export async function getMyRank(): Promise<MyRank> {
  const { data } = await apiClient.get<{ success: boolean; data: MyRank }>(
    "/leaderboard/me",
  );
  return data.data;
}

export async function getUserRank(userId: string): Promise<MyRank> {
  const { data } = await apiClient.get<{ success: boolean; data: MyRank }>(
    `/leaderboard/rank/${userId}`,
  );
  return data.data;
}
