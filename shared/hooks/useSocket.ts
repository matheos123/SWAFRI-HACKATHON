import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/shared/lib/socket";
import { useSocketStore } from "@/features/game/store/socket.store";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useSocket() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setConnected, setMatchmakingStatus, setQueuePosition, setMatchData } =
    useSocketStore();

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    connectSocket();

    //  Connection
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    //  Matchmaking 
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
        // Navigate to the game screen
        router.push(`/match/${data.matchId}`);
      },
    );

    // Notifications 
    socket.on(
      "notification:live",
      (data: { type: string; message: string }) => {
        console.log("[notification]", data.type, data.message);
        // Toast integration can be added here
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

  // Disconnect when user logs out
  useEffect(() => {
    if (!user) disconnectSocket();
  }, [user]);
}
