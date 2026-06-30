import Editor from "@monaco-editor/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useYjsEditor } from "../../../shared/yjs/useYjsEditor";
import { useCursorAwareness } from "../../../shared/awareness/useCursorAwareness";

import { EditorContext } from "../EditorContext";

import { useReviewMarkers } from "../hooks/useReviewMarkers";
import { useCommentDecorations } from "../hooks/useCommentDecorations";

import {
  createComment,
  resolveComment,
  deleteComment,
} from "../../comments/commentSlice";

import CommentThread from "./CommentThread";
import CreateCommentPopup from "./CreateCommentPopup";
import LineCommentPanel from "./LineCommentPanel";

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
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);

  const review = useSelector((state) => state.review.review);

  const comments = useSelector((state) => state.comments.comments);

  const [editor, setEditor] = useState(null);

  const [hoverLine, setHoverLine] = useState(null);

  const [popupLine, setPopupLine] = useState(null);

  const [popupPosition, setPopupPosition] = useState(null);

  const [selectedComments, setSelectedComments] = useState([]);

  const [commentText, setCommentText] = useState("");

  const monacoRef = useRef(null);

  const commentsRef = useRef([]);

  const editorRef = useContext(EditorContext);

  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  useEffect(() => {
    if (!popupLine) return;

    const lineComments = comments.filter(
      (comment) => comment.line === popupLine && !comment.resolved,
    );

    setSelectedComments(lineComments);
  }, [comments, popupLine]);

  const closePopup = () => {
    setPopupLine(null);
    setPopupPosition(null);
    setSelectedComments([]);
    setCommentText("");
  };

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;

    monacoRef.current = monaco;

    setEditor(editor);

    editor.onMouseMove((e) => {
      if (
        e.target.type !== monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS &&
        e.target.type !== monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
      ) {
        setHoverLine(null);
        return;
      }

      setHoverLine(e.target.position.lineNumber);
    });

    editor.onMouseDown((e) => {
      if (e.target.type !== monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN)
        return;

      openCommentPanel(e.target.position.lineNumber);
    });
  };

  const openCommentPanel = (line) => {
    const editor = editorRef.current;

    if (!editor) return;

    const lineComments = commentsRef.current.filter(
      (comment) => comment.line === line && !comment.resolved,
    );

    setPopupLine(line);

    setPopupPosition({
      line,
      top: editor.getTopForLineNumber(line),
    });

    setSelectedComments(lineComments);

    // Clear draft when opening a new discussion
    if (lineComments.length === 0) {
      setCommentText("");
    }
  };

  useReviewMarkers({
    editor,
    monaco: monacoRef.current,
    review,
  });

  useCommentDecorations({
    editor,
    monaco: monacoRef.current,
    comments,
    hoverLine,
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

  useEffect(() => {
    if (!popupLine || !editorRef.current) return;

    setPopupPosition({
      line: popupLine,
      top: editorRef.current.getTopForLineNumber(popupLine),
    });
  }, [popupLine]);

  const handleCreateComment = async () => {
    if (!commentText.trim()) return;

    try {
      await dispatch(
        createComment({
          sessionId: session._id,
          line: popupLine,
          text: commentText,
        }),
      ).unwrap();

      setCommentText("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleResolveComment = (commentId) => {
    dispatch(resolveComment(commentId));

    closePopup();
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId));

    closePopup();
  };

  return (
    <div className="relative h-full w-full">
      <Editor
        height="100%"
        theme="vs-dark"
        language={languageMap[session?.language] || "javascript"}
        onMount={handleMount}
        options={{
          glyphMargin: true,
          fontSize: 14,
          minimap: {
            enabled: false,
          },
          wordWrap: "on",
          automaticLayout: true,
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
        }}
      />

      {popupPosition && (
        <LineCommentPanel
          line={popupLine}
          comments={selectedComments}
          position={popupPosition}
          commentText={commentText}
          setCommentText={setCommentText}
          onComment={handleCreateComment}
          onResolve={handleResolveComment}
          onDelete={handleDeleteComment}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default CodeEditor;
