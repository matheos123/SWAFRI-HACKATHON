import apiClient from "@/shared/lib/axios";

//Types 

export interface FriendUser {
  id: string;
  username: string;
  avatar: string | null;
  walletAddress: string | null;
  wins: number;
  losses: number;
  totalMatches: number;
  points: number;
}

export interface Friendship {
  id: string; // friendship UUID
  friendId: string; // the other user's ID
  username: string;
  avatar: string | null;
  status: "ACCEPTED" | "PENDING" | "BLOCKED";
}

export interface FriendRequest {
  id: string; // friendship UUID
  requesterId: string;
  username: string;
  avatar: string | null;
  createdAt: string;
}

//  Endpoints 

/** GET /users/:id — preview a user before sending a request */
export async function getUserById(userId: string): Promise<FriendUser> {
  const { data } = await apiClient.get<{ success: boolean; data: FriendUser }>(
    `/users/${userId}`,
  );
  return data.data;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  username: string;
  avatar: string | null;
  walletAddress: string | null;
  wins: number;
  losses: number;
  totalMatches: number;
  points: number;
}

/** GET /leaderboard — fetch ranked players to list in invite modal */
export async function getLeaderboardUsers(limit = 50, offset = 0): Promise<LeaderboardUser[]> {
  const { data } = await apiClient.get<{ success: boolean; data: LeaderboardUser[] }>(
    "/leaderboard",
    { params: { limit, offset } }
  );
  return data.data;
}

/** POST /friends/request */
export async function sendFriendRequest(addresseeId: string): Promise<void> {
  await apiClient.post("/friends/request", { addresseeId });
}

/** PATCH /friends/respond */
export async function respondToFriendRequest(
  friendshipId: string,
  action: "ACCEPTED" | "BLOCKED",
): Promise<void> {
  await apiClient.patch("/friends/respond", { friendshipId, action });
}

/** GET /friends */
export async function getFriends(): Promise<Friendship[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: Friendship[];
  }>("/friends");
  return data.data;
}

/** GET /friends/requests */
export async function getFriendRequests(): Promise<FriendRequest[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: FriendRequest[];
  }>("/friends/requests");
  return data.data;
}

/** DELETE /friends/:friendId */
export async function removeFriend(friendId: string): Promise<void> {
  await apiClient.delete(`/friends/${friendId}`);
}
