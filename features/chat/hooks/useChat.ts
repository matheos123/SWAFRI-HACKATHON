import { useEffect, useState, useCallback } from "react";
import { getSocket } from "@/shared/lib/socket";
import { useAuthStore } from "@/features/auth/store/auth.store";

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  roomId?: string;
}

export function useChat(defaultRoomId: string = "lobby") {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentRoom, setCurrentRoom] = useState(defaultRoomId);

  const joinRoom = useCallback((roomId: string) => {
    if (!roomId) return;
    setCurrentRoom(roomId);
    setMessages([]); // Clear previous messages

    const socket = getSocket();
    socket.emit("chat:join", { roomId });
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!user || !content.trim() || !currentRoom) return;

      const socket = getSocket();
      socket.emit("chat:message", {
        roomId: currentRoom,
        userId: user.id,
        username: user.username,
        content: content.trim(),
      });
    },
    [user, currentRoom],
  );

  useEffect(() => {
    if (!user || !currentRoom) return;

    const socket = getSocket();

    // Join room
    socket.emit("chat:join", { roomId: currentRoom });

    // History on join
    const onJoined = (data: { roomId: string; history: ChatMessage[] }) => {
      if (data.roomId === currentRoom) {
        setMessages(data.history || []);
      }
    };

    // New message
    const onMessage = (msg: ChatMessage) => {
      if (msg.roomId === currentRoom) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("chat:joined", onJoined);
    socket.on("chat:message", onMessage);

    return () => {
      socket.off("chat:joined", onJoined);
      socket.off("chat:message", onMessage);
    };
  }, [user, currentRoom]);

  return {
    messages,
    currentRoom,
    joinRoom,
    sendMessage,
  };
}
