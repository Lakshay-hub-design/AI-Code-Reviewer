import * as Y from "yjs";
import { getOrCreateDoc } from "./yjs-doc-manager.js";
import { scheduleSave } from "./yjs-persistence.js";

export const yjsHandler = (io, socket) => {
  socket.on("yjs-update", ({ sessionId, update }) => {
    const { ydoc } = getOrCreateDoc(sessionId);

    Y.applyUpdate(ydoc, new Uint8Array(update));

    scheduleSave(sessionId, ydoc);

    socket.to(`session:${sessionId}`).emit("yjs-update", update);
  });
};
