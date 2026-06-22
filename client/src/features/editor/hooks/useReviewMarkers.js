import { useEffect } from "react";

export const useReviewMarkers = ({
  editor,
  monaco,
  review,
}) => {
  useEffect(() => {
    if (
      !editor ||
      !monaco ||
      !review
    ) {
      return;
    }

    const markers =
      review.results.map(
        (issue) => ({
          startLineNumber:
            issue.line || 1,

          startColumn: 1,

          endLineNumber:
            issue.line || 1,

          endColumn:
            Number.MAX_SAFE_INTEGER,

          message: `
${issue.message}

Suggestion:
${issue.suggestion}
          `,

          severity:
            issue.severity ===
            "critical"
              ? monaco.MarkerSeverity.Error
              : issue.severity ===
                  "warning"
                ? monaco
                    .MarkerSeverity
                    .Warning
                : monaco
                    .MarkerSeverity
                    .Info,
        }),
      );

    monaco.editor.setModelMarkers(
      editor.getModel(),
      "ai-review",
      markers,
    );

    return () => {
      monaco.editor.setModelMarkers(
        editor.getModel(),
        "ai-review",
        [],
      );
    };
  }, [
    editor,
    monaco,
    review,
  ]);
};