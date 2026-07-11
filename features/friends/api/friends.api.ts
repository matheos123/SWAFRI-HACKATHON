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
  id: string;
  requesterId?: string;
  addresseeId?: string; // for outgoing
  username: string;
  avatar: string | null;
  createdAt: string;
  status?: "PENDING" | "ACCEPTED" | "BLOCKED";
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
// In ../api/friends.api.ts
export async function getUsersForInvite(params: { limit?: number; search?: string } = {}) {
  try {
    const { data } = await apiClient.get("/users/public", { 
      params: { 
        limit: params.limit || 50, 
        search: params.search || undefined,
        page: 1 
      }
    });

    // Handle multiple possible response shapes
    if (data?.data?.data) {
      return data.data;           // nested {data, total, ...}
    }
    if (Array.isArray(data?.data)) {
      return { data: data.data };
    }
    if (Array.isArray(data)) {
      return { data };
    }

    console.warn("Unexpected users response shape:", data);
    return { data: [] };
  } catch (error: any) {
    console.error("Failed to fetch users:", error.response?.data || error.message);
    throw error;
  }
}

/** GET /leaderboard — fetch ranked players to list in invite modal */
export async function getLeaderboardUsers(limit = 50, offset = 0): Promise<LeaderboardUser[]> {
  const { data } = await apiClient.get<{ success: boolean; data: LeaderboardUser[] }>(
    "/users/public",
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
/** GET /friends/requests */
export async function getFriendRequests(): Promise<FriendRequest[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: any[];           // raw response
  }>("/friends/requests");

  // Map the nested requester data
  return (data.data || []).map((req: any) => ({
    id: req.id,
    requesterId: req.requesterId,
    username: req.requester?.username || "Unknown",
    avatar: req.requester?.avatar || null,
    createdAt: req.createdAt,
    // You can add more fields if needed
  }));
}
/** DELETE /friends/:friendId */
export async function removeFriend(friendId: string): Promise<void> {
  await apiClient.delete(`/friends/${friendId}`);
}

/** GET /friends/requests/outgoing — list of sent friend requests */
export async function getOutgoingFriendRequests(): Promise<FriendRequest[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: any[];           // raw array
  }>("/friends/requests/outgoing");

  return (data.data || []).map((req: any) => ({
    id: req.id,
    addresseeId: req.addresseeId,
    username: req.addressee?.username || "Unknown",
    avatar: req.addressee?.avatar || null,
    createdAt: req.createdAt,
    status: req.status,
  }));
}
