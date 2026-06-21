import { useEffect } from "react";
import { MonacoBinding } from "y-monaco";

import { YjsSocketProvider } from "./YjsSocketProvider";

import { destroyYDoc, initializeDoc } from "./YjsDoc";

export const useYjsEditor = ({ editor, sessionId }) => {
  useEffect(() => {
    if (!editor || !sessionId) return;

    const ydoc = initializeDoc(sessionId);

    const provider = new YjsSocketProvider({
      sessionId,
      ydoc,
    });

    provider.socket.emit("join-session", {
      sessionId,
    });

    const yText = ydoc.getText("content");

    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
    );

    return () => {
      provider.socket.emit("leave-session", {
        sessionId,
      });
      binding.destroy();
      provider.destroy();
      destroyYDoc(sessionId)
    };
  }, [editor, sessionId]);
};