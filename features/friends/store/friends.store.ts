import { create } from "zustand";
import {
  getFriends,
  getFriendRequests,
  respondToFriendRequest,
  removeFriend,
  Friendship,
  FriendRequest,
  getOutgoingFriendRequests,
  inviteFriendToGame,
} from "../api/friends.api";

export interface GameInvite {
  id: string;
  senderId: string;
  username: string;
  avatar: string | null;
  roomId: string;
  matchId: string;
  isRanked?: boolean;
}

interface FriendsState {
  friends: Friendship[];
  requests: FriendRequest[];
  gameInvites: GameInvite[];
  isLoading: boolean;
  error: string | null;
  outgoingRequests: FriendRequest[]; 

  loadOutgoingRequests: () => Promise<void>;

  loadFriends: () => Promise<void>;
  loadRequests: () => Promise<void>;
  acceptRequest: (friendshipId: string) => Promise<void>;
  blockRequest: (friendshipId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  addIncomingRequest: (request: FriendRequest) => void; // called from socket
  addGameInvite: (invite: GameInvite) => void;
  declineGameInvite: (inviteId: string) => void;
  sendGameChallenge: (friendId: string) => Promise<void>;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  requests: [],
  gameInvites: [],
  isLoading: false,
  error: null,
  outgoingRequests: [],

  loadFriends: async () => {
    set({ isLoading: true, error: null });
    try {
      const friends = await getFriends();
      set({ friends, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load friends",
        isLoading: false,
      });
    }
  },

  loadRequests: async () => {
    try {
      const requests = await getFriendRequests();
      set({ requests });
    } catch (err) {
      console.error("Failed to load requests:", err);
      set({ requests: [] });
    }
  },

  acceptRequest: async (friendshipId) => {
    await respondToFriendRequest(friendshipId, "ACCEPTED");
    set((s) => ({
      requests: s.requests.filter((r) => r.id !== friendshipId),
    }));
    // Reload friends list to include the newly accepted friend
    get().loadFriends();
  },

  blockRequest: async (friendshipId) => {
    await respondToFriendRequest(friendshipId, "BLOCKED");
    set((s) => ({
      requests: s.requests.filter((r) => r.id !== friendshipId),
    }));
  },

  removeFriend: async (friendId) => {
    await removeFriend(friendId);
    set((s) => ({
      friends: s.friends.filter((f) => f.friendId !== friendId),
    }));
  },

  addIncomingRequest: (request) => {
    set((s) => ({ requests: [request, ...s.requests] }));
  },

  addGameInvite: (invite) => {
    set((s) => ({ gameInvites: [invite, ...s.gameInvites] }));
  },

  declineGameInvite: (inviteId) => {
    set((s) => ({
      gameInvites: s.gameInvites.filter((i) => i.id !== inviteId),
    }));
  },
  sendGameChallenge: async (friendId: string) => {
    await inviteFriendToGame(friendId);
  },
  loadOutgoingRequests: async () => {
    try {
      const outgoing = await getOutgoingFriendRequests();
      set({ outgoingRequests: outgoing });
    } catch (err) {
      console.error("Failed to load outgoing requests:", err);
      set({ outgoingRequests: [] });
    }
  },
}));
