export const cursorHandler = (io, socket) => {

  // Broadcast cursor position to everyone else in the session room
  socket.on('cursor-move', ({ sessionId, position, userId, username, color }) => {
    socket.to(sessionId).emit('cursor-update', {
      socketId: socket.id,
      userId,
      username,
      color,   // each user gets a unique colour assigned on the client
      position,
    });
  });

  // Broadcast text selection range
  socket.on('selection-change', ({ sessionId, selection, userId }) => {
    socket.to(sessionId).emit('selection-update', {
      socketId: socket.id,
      userId,
      selection,
    });
  });
};