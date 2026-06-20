import Session from "../models/Session.js";
import * as Y from "yjs";
import { getOrCreateDoc } from "./yjs-doc-manager.js";
import { removeDoc } from "./yjs-doc-manager.js";
import { saveNow } from "./yjs-persistence.js";

export const editorHandler = (io, socket) => {
  socket.on("join-session", async ({ sessionId }) => {
    try {
      const session = await Session.findById(sessionId);

      if (!session) return;

      const docData = getOrCreateDoc(sessionId);

      const { ydoc } = docData;

      if (!docData.initialized) {
        const yText = ydoc.getText("content");

        yText.insert(0, session.code || "");

        docData.initialized = true;
      }

      const roomId = `session:${sessionId}`;

      socket.join(roomId);

      const state = Y.encodeStateAsUpdate(ydoc);

      socket.emit("yjs-sync", state);

      const sockets = await io.in(roomId).fetchSockets();

      const onlineUserIds = [...new Set(sockets.map((s) => s.userId))];

      io.to(roomId).emit("presence:update", onlineUserIds);
    } catch (err) {
      socket.emit("error", {
        message: "Failed to join session",
      });
    }
  });

  socket.on("language-change", ({ sessionId, language }) => {
    socket.to(`session:${sessionId}`).emit("language-change", { language });
  });

  socket.on("leave-session", async ({ sessionId }) => {
    const roomId = `session:${sessionId}`;

    socket.leave(roomId);

    const room = io.sockets.adapter.rooms.get(roomId);

    if (!room || room.size === 0) {
      await saveNow(sessionId, docData.ydoc);
      removeDoc(sessionId);
    }

    const sockets = await io.in(roomId).fetchSockets();

    const onlineUserIds = [...new Set(sockets.map((s) => s.userId))];

    io.to(roomId).emit("presence:update", onlineUserIds);
  });

  socket.on("disconnecting", async () => {
    for (const room of socket.rooms) {
      if (room !== socket.id && room.startsWith("session:")) {
        const sockets = await io.in(room).fetchSockets();

        const onlineUserIds = [
          ...new Set(
            sockets.filter((s) => s.id !== socket.id).map((s) => s.userId),
          ),
        ];

        const room = io.sockets.adapter.rooms.get(roomId);

        if (!room || room.size === 0) {
          await saveNow(sessionId, docData.ydoc);
          removeDoc(sessionId);
        }

        io.to(room).emit("presence:update", onlineUserIds);
      }
    }
  });
};
