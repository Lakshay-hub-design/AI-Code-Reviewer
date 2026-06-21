import * as Y from "yjs";

const docs = new Map();

export const getYDoc = (
  sessionId
) => {
  if (!docs.has(sessionId)) {
    docs.set(
      sessionId,
      new Y.Doc()
    );
  }

  return docs.get(sessionId);
};

export const initializeDoc = (
  sessionId
) => {
  return getYDoc(sessionId);
};

export const destroyYDoc = (
  sessionId
) => {
  const doc =
    docs.get(sessionId);

  if (!doc) return;

  doc.destroy();

  docs.delete(sessionId);
};