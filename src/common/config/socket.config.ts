import { SocketConfig } from './socket.config.interface';

export default (): SocketConfig => ({
  socket: {
    path: '/socket.io',
    cors: true,
  },
});
