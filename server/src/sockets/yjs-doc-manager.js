import * as Y from "yjs";

const docs = new Map();

export const getOrCreateDoc = (sessionId) => {
  if (!docs.has(sessionId)) {
    docs.set(sessionId, {
      ydoc: new Y.Doc(),
      initialized: false,
    });
  }

  return docs.get(sessionId);
};

export const removeDoc = (sessionId) => {
  const docData = docs.get(sessionId);

  if (!docData) return;

  docData.ydoc.destroy();

  docs.delete(sessionId);
};