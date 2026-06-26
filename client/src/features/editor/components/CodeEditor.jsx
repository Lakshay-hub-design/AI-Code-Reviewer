import Editor from "@monaco-editor/react";
import { useRef, useState, useContext } from "react";
import { useSelector } from "react-redux";

import { useYjsEditor } from "../../../shared/yjs/useYjsEditor";
import { useCursorAwareness } from "../../../shared/awareness/useCursorAwareness";
import { EditorContext } from "../EditorContext";
import { useReviewMarkers } from "../hooks/useReviewMarkers";

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

const CodeEditor = ({ session }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const review = useSelector(
    (state) => state.review.review
  )
  
  const [editor, setEditor] = useState(null);

  const monacoRef = useRef(null);
  const sharedEditorRef = useContext(EditorContext);
  const handleMount = (editor, monaco) => {
    sharedEditorRef.current = editor;
    setEditor(editor);

    monacoRef.current = monaco;
  };
  useReviewMarkers({
    editor,
    monaco:
      monacoRef.current,
    review,
  });

  useYjsEditor({
    editor,
    sessionId: session._id,
  });

  useCursorAwareness({
    editor,
    monaco: monacoRef.current,
    sessionId: session._id,
    currentUser,
  });

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={languageMap[session?.language] || "javascript"}
      onMount={handleMount}
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;