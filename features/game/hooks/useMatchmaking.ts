import { useAuthStore } from "@/features/auth/store/auth.store";
import { useSocketStore } from "@/features/game/store/socket.store";
import { getSocket } from "@/shared/lib/socket";

export function useMatchmaking() {
  const { user } = useAuthStore();
  const { matchmakingStatus, queuePosition, resetMatchmaking } =
    useSocketStore();

  const joinQueue = () => {
    if (!user) return;
    const socket = getSocket();
    socket.emit("matchmaking:join", {
      userId: user.id,
      username: user.username,
    });
  };

  const cancelQueue = () => {
    if (!user) return;
    const socket = getSocket();
    socket.emit("matchmaking:cancel", { userId: user.id });
    resetMatchmaking();
  };

  return {
    matchmakingStatus,
    queuePosition,
    isQueued: matchmakingStatus === "queued",
    joinQueue,
    cancelQueue,
  };
}
