export const cursorHandler = (io, socket) => {
  socket.on(
    "cursor-move",
    ({ sessionId, position, userId, username, color }) => {
      socket.to(`session:${sessionId}`).emit("cursor-update", {
        socketId: socket.id,
        userId,
        username,
        color,
        position,
      });
    },
  );

  socket.on("selection-change", ({ sessionId, selection, userId }) => {
    socket.to(`session:${sessionId}`).emit("selection-update", {
      socketId: socket.id,
      userId,
      selection,
    });
  });
};
  