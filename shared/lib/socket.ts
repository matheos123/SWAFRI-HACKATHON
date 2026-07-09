import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://rps-arena-2q2f.onrender.com";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true, // sends httpOnly cookie for auth
      transports: ["websocket"],
      autoConnect: false, // we connect manually after login
    });
  }
  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) s.connect();
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
