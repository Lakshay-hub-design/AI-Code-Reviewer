import Session from "../models/Session.js";

export const editorHandler = (io, socket) => {
  socket.on("join-session", async ({ sessionId }) => {
    try {
      const session = await Session.findById(sessionId);

      if (!session) return;

      const roomId = `session:${sessionId}`;

      socket.join(roomId);

      const sockets = await io.in(roomId).fetchSockets();

      const onlineUserIds = [...new Set(sockets.map((s) => s.userId))];

      io.to(roomId).emit("presence:update", onlineUserIds);
    } catch (err) {
      socket.emit("error", {
        message: "Failed to join session",
      });
    }
  });

  socket.on("code-change", ({ sessionId, code }) => {
    socket.to(`session:${sessionId}`).emit("code-change", { code });
  });

  socket.on("code-save", async ({ sessionId, code }) => {
    try {
      await Session.findByIdAndUpdate(sessionId, {
        code,
        lastEditedAt: new Date(),
      });
    } catch (err) {
      console.error("code-save error:", err.message);
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

        io.to(room).emit("presence:update", onlineUserIds);
      }
    }
  });
};
