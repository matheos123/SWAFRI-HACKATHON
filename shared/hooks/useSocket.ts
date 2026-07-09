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

export function useSocket() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setConnected, setMatchmakingStatus, setQueuePosition, setMatchData } =
    useSocketStore();
  const { addIncomingRequest, loadRequests } = useFriendsStore();

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
        router.push(`/match/${data.matchId}`);
      },
    );

    // ── Notifications 
    socket.on(
      "notification:live",
      (data: { type: string; message: string; data?: any }) => {
        console.log("[notification]", data.type, data.message);

        if (data.type === "friend_request" && data.data) {
          // Add new request to store in real-time
          addIncomingRequest({
            id: data.data.friendshipId ?? data.data.id,
            requesterId: data.data.requesterId ?? data.data.senderId,
            username: data.data.username ?? "Unknown",
            avatar: data.data.avatar ?? null,
            createdAt: new Date().toISOString(),
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
      socket.off("notification:live");
    };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) disconnectSocket();
  }, [user]);
}
