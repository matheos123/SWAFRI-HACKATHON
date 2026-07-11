import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/shared/lib/socket";
import { useSocketStore } from "@/features/game/store/socket.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useFriendsStore } from "@/features/friends/store/friends.store";
import { getSquadRoomId, useSquadStore } from "@/features/friends/store/squad.store";

interface LiveNotificationPayload {
  type: string;
  message: string;
  data?: {
    id?: string;
    friendshipId?: string;
    requesterId?: string;
    senderId?: string;
    username?: string;
    avatar?: string | null;
    roomId?: string;
    matchId?: string;
    inviterId?: string;
    isRanked?: boolean;
  };
}

export function useSocket() {
  const router = useRouter();
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

    socket.on("chat:message", (msg: { roomId?: string; content: string }) => {
      const { squad } = useSquadStore.getState();
      if (squad && msg.roomId === getSquadRoomId(squad.name) && msg.content?.startsWith("SYSTEM:MATCH_START:")) {
        const parts = msg.content.split(":");
        const matchId = parts[2];
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
            id: data.data.matchId ?? data.data.roomId ?? String(Date.now()),
            senderId: data.data.senderId ?? data.data.inviterId ?? "Unknown",
            username: data.data.username ?? "Unknown",
            avatar: data.data.avatar ?? null,
            roomId: data.data.roomId ?? data.data.matchId ?? String(Date.now()),
            matchId: data.data.matchId ?? data.data.roomId ?? String(Date.now()),
            isRanked: data.data.isRanked,
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
      socket.off("matchmaking:queued");
      socket.off("matchmaking:matched");
      socket.off("chat:message");
      socket.off("notification:live");
    };
  }, [user]); 

  useEffect(() => {
    if (!user) disconnectSocket();
  }, [user]);
}
