import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};