import { useEffect, useRef } from "react";
import { getSocket } from "../socket/socket";

const getUserColor = (id) => {
  const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
  ];

  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i);
  }

  return colors[hash % colors.length];
};

export const useCursorAwareness = ({
  editor,
  monaco,
  sessionId,
  currentUser,
}) => {
  const socket = getSocket();

  const remoteDecorationsRef = useRef(new Map());
  const selectionDecorationsRef = useRef(new Map());

  useEffect(() => {
    if (!editor || !monaco || !sessionId) {
      return;
    }

    const user = {
      id: currentUser._id,
      name: currentUser.username,
      color: getUserColor(currentUser._id),
    };

    const cursorDisposable = editor.onDidChangeCursorPosition((e) => {
      socket.emit("cursor-update", {
        sessionId,

        cursor: {
          line: e.position.lineNumber,
          column: e.position.column,
        },

        user,
      });
    });

    const selectionDisposable = editor.onDidChangeCursorSelection((e) => {
      socket.emit("selection-update", {
        sessionId,

        user,

        selection: {
          startLine: e.selection.startLineNumber,

          startColumn: e.selection.startColumn,

          endLine: e.selection.endLineNumber,

          endColumn: e.selection.endColumn,
        },
      });
    });

    const handleCursorUpdate = ({ socketId, cursor, user }) => {
      const className = `cursor-${socketId}`;

      let style = document.getElementById(className);

      if (!style) {
        style = document.createElement("style");

        style.id = className;

        style.innerHTML = `
          .${className} {
            border-left: 2px solid ${user.color};
          }

          .${className}-label::before {
            content: "${user.name}";
            position: absolute;
            top: -18px;
            left: 0;
            background: ${user.color};
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
          }
        `;

        document.head.appendChild(style);
      }

      const decorations = editor.deltaDecorations(
        remoteDecorationsRef.current.get(socketId) || [],
        [
          {
            range: new monaco.Range(
              cursor.line,
              cursor.column,
              cursor.line,
              cursor.column,
            ),

            options: {
              className,

              afterContentClassName: `${className}-label`,
            },
          },
        ],
      );

      remoteDecorationsRef.current.set(socketId, decorations);
    };

    const handleSelectionUpdate = ({ socketId, user, selection }) => {
      const className = `selection-${socketId}`;

      let style = document.getElementById(className);

      if (!style) {
        style = document.createElement("style");

        style.id = className;

        style.innerHTML = `
          .${className} {
            background: ${user.color}33;
          }
        `;

        document.head.appendChild(style);
      }

      const decorations = editor.deltaDecorations(
        selectionDecorationsRef.current.get(socketId) || [],
        [
          {
            range: new monaco.Range(
              selection.startLine,
              selection.startColumn,
              selection.endLine,
              selection.endColumn,
            ),

            options: {
              className,
            },
          },
        ],
      );

      selectionDecorationsRef.current.set(socketId, decorations);
    };

    const handleCursorRemove = ({ socketId }) => {
      const cursorStyle = document.getElementById(`cursor-${socketId}`);

      const selectionStyle = document.getElementById(`selection-${socketId}`);

      cursorStyle?.remove();
      selectionStyle?.remove();

      const cursorIds = remoteDecorationsRef.current.get(socketId);

      if (cursorIds) {
        editor.deltaDecorations(cursorIds, []);

        remoteDecorationsRef.current.delete(socketId);
      }

      const selectionIds = selectionDecorationsRef.current.get(socketId);

      if (selectionIds) {
        editor.deltaDecorations(selectionIds, []);

        selectionDecorationsRef.current.delete(socketId);
      }
    };

    socket.on("cursor-update", handleCursorUpdate);

    socket.on("selection-update", handleSelectionUpdate);

    socket.on("cursor-remove", handleCursorRemove);

    return () => {
      cursorDisposable.dispose();

      selectionDisposable.dispose();

      socket.off("cursor-update", handleCursorUpdate);

      socket.off("selection-update", handleSelectionUpdate);

      socket.off("cursor-remove", handleCursorRemove);
    };
  }, [editor, monaco, sessionId, currentUser]);
};
