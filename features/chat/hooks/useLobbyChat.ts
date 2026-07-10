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

export function useLobbyChat(roomId = "lobby") {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!user || !roomId) return;
    const socket = getSocket();

    setMessages([]);
    setIsJoined(false);

    // Join chat room
    socket.emit("chat:join", { roomId });

    // Receive history on join
    const handleJoined = (data: { roomId: string; history: ChatMessage[] }) => {
      if (data.roomId === roomId) {
        setMessages(data.history ?? []);
        setIsJoined(true);
      }
    };

    socket.on("chat:joined", handleJoined);

    // Receive new messages
    const handleMessage = (data: ChatMessage & { roomId?: string }) => {
      if (!data.roomId || data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("chat:message", handleMessage);

    // Receive history on manual request
    const handleHistory = (data: { roomId: string; messages: ChatMessage[] }) => {
      if (data.roomId === roomId) {
        setMessages(data.messages ?? []);
      }
    };

    socket.on("chat:history", handleHistory);

    return () => {
      socket.off("chat:joined", handleJoined);
      socket.off("chat:message", handleMessage);
      socket.off("chat:history", handleHistory);
    };
  }, [user, roomId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!user || !content.trim() || !roomId) return;
      const socket = getSocket();
      socket.emit("chat:message", {
        roomId,
        userId: user.id,
        username: user.username,
        content: content.trim(),
      });
    },
    [user, roomId],
  );

  return { messages, isJoined, sendMessage };
}
