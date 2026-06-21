import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useYjsEditor } from "../../../shared/yjs/useYjsEditor";
import { useCursorAwareness } from "../../../shared/awareness/useCursorAwareness";

const languageMap = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
  go: "go",
  rust: "rust",
  html: "html",
  css: "css",
};

const CodeEditor = ({
  session,
}) => {
  const currentUser =
    useSelector(
      (state) => state.auth.user
    );

  const [editor, setEditor] =
    useState(null);

  const monacoRef =
    useRef(null);

  const handleMount = (
    editor,
    monaco
  ) => {
    setEditor(editor);

    monacoRef.current =
      monaco;
  };

  useYjsEditor({
    editor,
    sessionId:
      session._id,
  });

  useCursorAwareness({
    editor,
    monaco:
      monacoRef.current,
    sessionId:
      session._id,
    currentUser,
  });

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={
        languageMap[
          session?.language
        ] ||
        "javascript"
      }
      onMount={
        handleMount
      }
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine:
          false,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;