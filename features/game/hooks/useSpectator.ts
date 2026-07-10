import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/shared/lib/socket";
import { useGameStore } from "../store/game.store";

export interface ActiveRoom {
  roomId: string;
  matchId?: string;
  player1: { userId: string; username: string };
  player2: { userId: string; username: string };
  round: number;
  isRanked: boolean;
}

export function useSpectator() {
  const [rooms, setRooms] = useState<ActiveRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { initGame } = useGameStore();

  const fetchRooms = () => {
    setIsLoading(true);
    const socket = getSocket();
    socket.emit("game:list_rooms");
  };

  useEffect(() => {
    const socket = getSocket();

    socket.on("game:rooms", (data: ActiveRoom[]) => {
      setRooms(data ?? []);
      setIsLoading(false);
    });

    socket.on("spectate:joined", (data: any) => {
      // Navigate to match screen in spectator mode
      if (data.roomId) {
        router.push(`/spectate/${data.roomId}`);
      }
    });

    return () => {
      socket.off("game:rooms");
      socket.off("spectate:joined");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const joinAsSpectator = (roomId: string) => {
    const socket = getSocket();
    socket.emit("spectate:join", { roomId });
  };

  return { rooms, isLoading, fetchRooms, joinAsSpectator };
}
