import Message from "../models/Message.js";

export const chatHandler = (io, socket) => {
  socket.on("chat-message", async ({ sessionId, text }) => {
    const message = await Message.create({
      session: sessionId,

      sender: socket.userId,

      text,
    });

    await message.populate("sender", "username");

    io.to(`session:${sessionId}`).emit("chat-message", message);
  });

  socket.on("typing-start", ({ sessionId, user }) => {
    socket.to(`session:${sessionId}`).emit("typing-start", {
      socketId: socket.id,
      user,
    });
  });

  socket.on("typing-stop", ({ sessionId }) => {
    socket.to(`session:${sessionId}`).emit("typing-stop", {
      socketId: socket.id,
    });
  });
};
