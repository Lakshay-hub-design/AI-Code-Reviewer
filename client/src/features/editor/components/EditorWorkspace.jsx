import {
  Sparkles,
  Save,
  Wifi,
} from "lucide-react";

import CodeEditor from "./CodeEditor";
import { useDispatch, useSelector } from "react-redux";
import { generateReview } from "../../review/reviewSlice";

const EditorWorkspace = ({
  session,
}) => {
  const dispatch = useDispatch();

  const { isLoading } = useSelector(
    (state) => state.review
  )

const handleReview = () => {
  dispatch(
    generateReview(session._id)
  );
};
  return (
    <main
      className="
        flex-1
        bg-[#09090B]
        flex
        flex-col
        overflow-hidden
      "
    >
      {/* Toolbar */}
      <div
        className="
          h-12
          border-b
          border-zinc-800
          bg-[#111114]
          px-4
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-4">
          <span
            className="
              text-sm
              font-medium
              text-violet-400
              uppercase
            "
          >
            {session?.language}
          </span>

          <span className="text-xs text-zinc-500">
            Collaborative Session
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="
              px-3
              py-1.5
              rounded-lg
              bg-zinc-800
              text-sm
              flex
              items-center
              gap-2
            "
          >
            <Save size={14} />
            Save
          </button>

          <button
            onClick={handleReview}
            disabled={isLoading}
            className="
              px-3
              py-1.5
              rounded-lg
              bg-violet-600
              hover:bg-violet-700
              text-sm
              flex
              items-center
              gap-2
            "
          >
            <Sparkles size={14} />
            {isLoading
              ? "Reviewing..."
              : "Review AI"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >
          <CodeEditor
            session={session}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div
        className="
          h-8
          border-t
          border-zinc-800
          bg-[#111114]
          px-4
          flex
          items-center
          justify-between
          text-xs
        "
      >
        <div className="flex items-center gap-4">
          <span className="text-zinc-500">
            Ln 1, Col 1
          </span>

          <span className="text-zinc-500">
            {session?.language}
          </span>
        </div>

        <div className="flex items-center gap-1 text-green-400">
          <Wifi size={12} />
          Connected
        </div>
      </div>
    </main>
  );
};

export default EditorWorkspace;