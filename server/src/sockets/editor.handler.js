import Session from "../models/Session.js";
import * as Y from "yjs";
import { getDoc, getOrCreateDoc } from "./yjs-doc-manager.js";
import { removeDoc } from "./yjs-doc-manager.js";
import { saveNow } from "./yjs-persistence.js";
import { createActivity } from "../services/activity.service.js";

export const editorHandler = (io, socket) => {
  socket.on("join-session", async ({ sessionId }) => {
    try {
      const session = await Session.findById(sessionId);

      if (!session) return;

      const docData = getOrCreateDoc(sessionId);

      const { ydoc } = docData;

      if (!docData.initialized) {
        const yText = ydoc.getText("content");

        if (yText.length === 0) {
          yText.insert(0, session.code || "");
        }

        docData.initialized = true;
      }

      const roomId = `session:${sessionId}`;

      socket.join(roomId);

      const state = Y.encodeStateAsUpdate(ydoc);

      socket.emit("yjs-sync", Array.from(state));

      const sockets = await io.in(roomId).fetchSockets();

      const onlineUserIds = [...new Set(sockets.map((s) => s.userId))];

      io.to(roomId).emit("presence:update", onlineUserIds);

      await createActivity({
        session: sessionId,
        user: socket.userId,
        username: socket.displayName,
        type: 'join',
        message: 'joined the session'
      })
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

    const sockets = await io.in(roomId).fetchSockets();

    const onlineUserIds = [...new Set(sockets.map((s) => s.userId))];

    io.to(roomId).emit("presence:update", onlineUserIds);

    socket.to(`session:${sessionId}`).emit("cursor-remove", {
      socketId: socket.id,
    });

    await createActivity({
        session: sessionId,
        user: socket.userId,
        username: socket.username,
        type: 'leave',
        message: 'leaved the session'
      })
  });

  socket.on("disconnecting", async () => {
    for (const roomName of socket.rooms) {
      if (roomName !== socket.id && roomName.startsWith("session:")) {
        const sessionId = roomName.replace("session:", "");

        const room = io.sockets.adapter.rooms.get(roomName);

        if (room && room.size === 1) {
          const docData = getOrCreateDoc(sessionId);

          await saveNow(sessionId, docData.ydoc);

          removeDoc(sessionId);
        }

        const sockets = await io.in(roomName).fetchSockets();

        const onlineUserIds = [
          ...new Set(
            sockets.filter((s) => s.id !== socket.id).map((s) => s.userId),
          ),
        ];

        io.to(roomName).emit("presence:update", onlineUserIds);
      }
    }
  });
};
