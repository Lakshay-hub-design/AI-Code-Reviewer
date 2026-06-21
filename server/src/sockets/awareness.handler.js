const awarenessStates = new Map();

export const awarenessHandler = (io, socket) => {
  socket.on("cursor-update", ({ sessionId, cursor, user }) => {
    const roomId = `session:${sessionId}`;

    if (!awarenessStates.has(sessionId)) {
      awarenessStates.set(sessionId, new Map());
    }

    awarenessStates.get(sessionId).set(socket.id, {
      cursor,
      user,
    });

    socket.to(roomId).emit("cursor-update", {
      socketId: socket.id,
      cursor,
      user,
    });
  });

  socket.on("selection-update", ({ sessionId, user, selection }) => {
    socket.to(`session:${sessionId}`).emit("selection-update", {
      socketId: socket.id,
      user,
      selection,
    });
  });

  socket.on("disconnect", () => {
    for (const [sessionId, users] of awarenessStates) {
      if (users.has(socket.id)) {
        users.delete(socket.id);

        socket.to(`session:${sessionId}`).emit("cursor-remove", {
          socketId: socket.id,
        });
      }
    }
  });
};
