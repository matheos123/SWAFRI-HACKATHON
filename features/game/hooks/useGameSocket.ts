import { useEffect } from "react";
import { getSocket } from "@/shared/lib/socket";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  useGameStore,
  Move,
  RoundResult,
  MatchResult,
} from "../store/game.store";

export function useGameSocket(roomId: string) {
  const { user } = useAuthStore();
  const {
    setOpponentMoved,
    setRoundResult,
    nextRound,
    setMatchResult,
    setRematchRequested,
  } = useGameStore();

  useEffect(() => {
    if (!roomId || !user) return;

    const socket = getSocket();

    socket.on("game:move_received", () => {
      // My move was acknowledged — phase already set to "waiting" in store
    });

    socket.on("game:opponent_moved", () => {
      setOpponentMoved();
    });

    socket.on("game:round_result", (data: RoundResult) => {
      setRoundResult(data);
    });

    socket.on("game:next_round", (data: { roundNumber: number }) => {
      nextRound(data.roundNumber);
    });

    socket.on("game:match_result", (data: MatchResult) => {
      setMatchResult(data);
    });

    socket.on("game:rematch_requested", () => {
      setRematchRequested(true);
    });

    return () => {
      socket.off("game:move_received");
      socket.off("game:opponent_moved");
      socket.off("game:round_result");
      socket.off("game:next_round");
      socket.off("game:match_result");
      socket.off("game:rematch_requested");
    };
  }, [roomId, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitMove = (move: Move) => {
    if (!user || !roomId) return;
    const socket = getSocket();
    socket.emit("game:move", {
      roomId,
      userId: user.id,
      move,
    });
    useGameStore.getState().setMyMove(move);
  };

  const requestRematch = () => {
    if (!roomId) return;
    useGameStore.getState().setRematchRequested(false);
    getSocket().emit("game:rematch", { roomId });
  };

  return { submitMove, requestRematch };
}
