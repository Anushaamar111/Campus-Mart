import { io } from 'socket.io-client';

// Get base URL for socket connection
const getSocketUrl = () => {
  // In production, use same domain
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  // In development, use env var or localhost
  return import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
};

const SOCKET_URL = getSocketUrl();

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'], // Fallback for serverless
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const connectSocket = () => {
  const socketInstance = initSocket();
  if (!socketInstance.connected) {
    socketInstance.connect();
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;
