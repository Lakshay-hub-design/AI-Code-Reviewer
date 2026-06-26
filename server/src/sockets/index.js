import { Server } from "socket.io";
import { editorHandler } from "./editor.handler.js";
import { verifyToken } from "../utils/jwt.utils.js";
import { yjsHandler } from "./yjs.handler.js";
import { awarenessHandler } from "./awareness.handler.js";
import { chatHandler } from "./chat.handler.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.cookie
          ?.split("; ")
          .find((c) => c.startsWith("token="))
          ?.split("=")[1];

      if (!token) return next(new Error("Authentication required"));

      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id} (user: ${socket.userId})`);

    socket.join(`user:${socket.userId}`);

    yjsHandler(io, socket);
    editorHandler(io, socket);
    awarenessHandler(io, socket);
    chatHandler(io, socket)

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} — ${reason}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};
