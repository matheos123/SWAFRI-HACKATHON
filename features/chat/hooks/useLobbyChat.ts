import { useEffect, useState, useCallback } from "react";
import { getSocket } from "@/shared/lib/socket";
import { useAuthStore } from "@/features/auth/store/auth.store";

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

const LOBBY_ROOM = "lobby";

export function useLobbyChat() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    // Join lobby chat room
    socket.emit("chat:join", { roomId: LOBBY_ROOM });

    // Receive history on join
    socket.on(
      "chat:joined",
      (data: { roomId: string; history: ChatMessage[] }) => {
        if (data.roomId === LOBBY_ROOM) {
          setMessages(data.history ?? []);
          setIsJoined(true);
        }
      },
    );

    // Receive new messages
    socket.on("chat:message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    // Receive history on manual request
    socket.on(
      "chat:history",
      (data: { roomId: string; messages: ChatMessage[] }) => {
        if (data.roomId === LOBBY_ROOM) {
          setMessages(data.messages ?? []);
        }
      },
    );

    return () => {
      socket.off("chat:joined");
      socket.off("chat:message");
      socket.off("chat:history");
    };
  }, [user]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!user || !content.trim()) return;
      const socket = getSocket();
      socket.emit("chat:message", {
        roomId: LOBBY_ROOM,
        userId: user.id,
        username: user.username,
        content: content.trim(),
      });
    },
    [user],
  );

  return { messages, isJoined, sendMessage };
}
