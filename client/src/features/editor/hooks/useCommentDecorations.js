import { useEffect, useRef } from "react";

export const useCommentDecorations = ({
  editor,
  monaco,
  comments,
  hoverLine,
}) => {
  const decorations = useRef([]);

  useEffect(() => {
    if (!editor || !monaco) return;

const grouped = new Map();

comments
  .filter((c) => !c.resolved)
  .forEach((c) => {
    if (!grouped.has(c.line)) {
      grouped.set(c.line, []);
    }

    grouped.get(c.line).push(c);
  });

    const next = [];

    grouped.forEach((lineComments, line) => {
      next.push({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          glyphMarginClassName: "comment-glyph",
          glyphMarginHoverMessage: {
            value: `${lineComments.length} comment${lineComments.length > 1 ? "s" : ""}`,
          },
        },
      });
    });

    if (hoverLine && !grouped.has(hoverLine)) {
      next.push({
        range: new monaco.Range(hoverLine, 1, hoverLine, 1),

        options: {
          glyphMarginClassName: "comment-add-glyph",

          glyphMarginHoverMessage: {
            value: "Add comment",
          },
        },
      });
    }

    decorations.current = editor.deltaDecorations(decorations.current, next);
  }, [editor, monaco, comments, hoverLine]);
};
