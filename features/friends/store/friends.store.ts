import { create } from "zustand";
import {
  getFriends,
  getFriendRequests,
  respondToFriendRequest,
  removeFriend,
  Friendship,
  FriendRequest,
} from "../api/friends.api";

interface FriendsState {
  friends: Friendship[];
  requests: FriendRequest[];
  isLoading: boolean;
  error: string | null;

  loadFriends: () => Promise<void>;
  loadRequests: () => Promise<void>;
  acceptRequest: (friendshipId: string) => Promise<void>;
  blockRequest: (friendshipId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  addIncomingRequest: (request: FriendRequest) => void; // called from socket
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  requests: [],
  isLoading: false,
  error: null,

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
    } catch {
      // silent
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
}));
