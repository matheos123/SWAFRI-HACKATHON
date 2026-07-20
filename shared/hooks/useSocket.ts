import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/shared/lib/socket";
import { useSocketStore } from "@/features/game/store/socket.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useFriendsStore } from "@/features/friends/store/friends.store";
import { getSquadRoomId, useSquadStore } from "@/features/friends/store/squad.store";
import { LeaderboardPlayer } from "@/features/leaderboard/api/leaderboard.api";
import { NotificationItem, countUnreadNotifications } from "@/features/notifications/api/notifications.api";

interface LiveNotificationPayload {
  type: string;
  message: string;
  data?: {
    id?: string;
    friendshipId?: string;
    requesterId?: string;
    senderId?: string;
    fromUserId?: string;
    username?: string;
    fromUsername?: string;
    inviterUsername?: string;
    avatar?: string | null;
    roomId?: string;
    matchId?: string;
    inviterId?: string;
    isRanked?: boolean;
  };
}

export function useSocket() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { setConnected, setMatchmakingStatus, setQueuePosition, setMatchData } =
    useSocketStore();
  const { addIncomingRequest, loadRequests, addGameInvite } = useFriendsStore();

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    connectSocket();

    // ── Connection
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("leaderboard:update", (payload: LeaderboardPlayer[] | { data: LeaderboardPlayer[] }) => {
      const leaderboard = Array.isArray(payload) ? payload : payload.data;
      queryClient.setQueriesData(
        { queryKey: ["leaderboard"] },
        leaderboard,
      );
      void queryClient.invalidateQueries({
        queryKey: ["leaderboard"],
        refetchType: "inactive",
      });
    });

    // ── Matchmaking 
    socket.on("matchmaking:queued", (data: { position: number }) => {
      setMatchmakingStatus("queued");
      setQueuePosition(data.position);
    });

    socket.on(
      "matchmaking:matched",
      (data: {
        roomId: string;
        matchId: string;
        isRanked: boolean;
        opponent: { userId: string; username: string };
      }) => {
        setMatchmakingStatus("matched");
        setMatchData(data);
        // Bypassed router.push. Match is now inline in MatchArena.tsx on the lobby page
        
        // Broadcast this match start to our squad so they can auto-spectate
        const { squad } = useSquadStore.getState();
        if (squad) {
          socket.emit("chat:message", {
            roomId: getSquadRoomId(squad.name),
            userId: "system",
            username: "SYSTEM",
            content: `SYSTEM:MATCH_START:${data.matchId}:${data.roomId}`,
          });
        }
      },
    );

    // Private friend game match listener
    socket.on(
      "game:matched",
      (data: {
        roomId: string;
        matchId: string;
        isRanked: boolean;
        opponent: { userId: string; username: string };
      }) => {
        setMatchmakingStatus("matched");
        setMatchData(data);
      },
    );

    socket.on("chat:message", (msg: { roomId?: string; content: string }) => {
      const { squad } = useSquadStore.getState();
      if (squad && msg.roomId === getSquadRoomId(squad.name) && msg.content?.startsWith("SYSTEM:MATCH_START:")) {
        const parts = msg.content.split(":");
        const roomId = parts[3];
        if (roomId) {
          socket.emit("spectate:join", { roomId });
        }
      }
    });

    // ── Notifications 
    socket.on(
      "notification:live",
      (data: LiveNotificationPayload) => {
        console.log("[notification]", data.type, data.message);

        queryClient.setQueryData(
          ["notifications"],
          (current:
            | { items: NotificationItem[]; unreadCount: number }
            | undefined) => {
            const nextItem: NotificationItem = {
              id: data.data?.id ?? `${data.type}-${Date.now()}`,
              type: data.type,
              message: data.message,
              isRead: false,
              createdAt: new Date().toISOString(),
              data: data.data,
            };

            const existing = current?.items ?? [];
            const items = [nextItem, ...existing].slice(0, 20);

            return {
              items,
              unreadCount: countUnreadNotifications(items),
            };
          },
        );

        if (data.type === "friend_request" && data.data) {
          // Add new request to store in real-time
          addIncomingRequest({
            id: data.data.friendshipId ?? data.data.id ?? String(Date.now()),
            requesterId:
              data.data.requesterId ?? data.data.senderId ?? "unknown-user",
            username: data.data.username ?? "Unknown",
            avatar: data.data.avatar ?? null,
            createdAt: new Date().toISOString(),
          });
        }

        if (data.type === "game_invite" && data.data) {
          addGameInvite({
            id: data.data.id ?? data.data.matchId ?? String(Date.now()),
            senderId: data.data.fromUserId ?? data.data.senderId ?? data.data.inviterId ?? "Unknown",
            username: data.data.fromUsername ?? data.data.username ?? data.data.inviterUsername ?? "Friend",
            avatar: data.data.avatar ?? null,
            roomId: data.data.roomId ?? "",
            matchId: data.data.matchId ?? "",
            isRanked: data.data.isRanked ?? false,
          });
        }

        if (data.type === "friend_accepted") {
          // Reload friends list when someone accepts our request
          loadRequests();
        }
      },
    );

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("leaderboard:update");
      socket.off("matchmaking:queued");
      socket.off("matchmaking:matched");
      socket.off("chat:message");
      socket.off("notification:live");
    };
  }, [
    addGameInvite,
    addIncomingRequest,
    loadRequests,
    queryClient,
    setConnected,
    setMatchData,
    setMatchmakingStatus,
    setQueuePosition,
    user,
  ]);

  useEffect(() => {
    if (!user) disconnectSocket();
  }, [user]);
}
