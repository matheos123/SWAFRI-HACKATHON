import { useEffect, useCallback } from "react";
import { getSocket } from "@/shared/lib/socket";

export interface SquadMatchUpdate {
  champion?: { id: string; username: string };
  challenger?: { id: string; username: string };
  queue: Array<{ id: string; username: string }>;
}

export function useSquadSocket(squadId: string) {
  const joinQueue = useCallback(() => {
    if (!squadId) return;
    const socket = getSocket();
    socket.emit("squad:join_queue", { squadId });
  }, [squadId]);

  const leaveQueue = useCallback(() => {
    if (!squadId) return;
    const socket = getSocket();
    socket.emit("squad:leave_queue", { squadId });
  }, [squadId]);

  const getQueue = useCallback(() => {
    if (!squadId) return;
    const socket = getSocket();
    socket.emit("squad:get_queue", { squadId });
  }, [squadId]);

  useEffect(() => {
    if (!squadId) return;

    const socket = getSocket();

    const onMatchStarting = (data: any) => {
      console.log("Squad match starting", data);
    };

    const onMatchEnded = (data: any) => {
      console.log("Squad match ended", data);
    };

    const onQueueUpdated = (data: SquadMatchUpdate) => {
      console.log("Squad queue updated", data);
    };

    const onPlayerJoined = (data: { userId: string; username: string }) => {
      console.log("Player joined queue", data);
    };

    const onPlayerLeft = (data: { userId: string }) => {
      console.log("Player left queue", data);
    };

    socket.on("squad:match_starting", onMatchStarting);
    socket.on("squad:match_ended", onMatchEnded);
    socket.on("squad:queue_updated", onQueueUpdated);
    socket.on("squad:player_joined_queue", onPlayerJoined);
    socket.on("squad:player_left_queue", onPlayerLeft);

    return () => {
      socket.off("squad:match_starting", onMatchStarting);
      socket.off("squad:match_ended", onMatchEnded);
      socket.off("squad:queue_updated", onQueueUpdated);
      socket.off("squad:player_joined_queue", onPlayerJoined);
      socket.off("squad:player_left_queue", onPlayerLeft);
    };
  }, [squadId]);

  return {
    joinQueue,
    leaveQueue,
    getQueue,
  };
}
