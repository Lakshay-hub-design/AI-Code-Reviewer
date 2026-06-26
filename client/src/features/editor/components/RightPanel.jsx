import { useDispatch, useSelector } from "react-redux";
import { useContext, useState } from "react";
import { EditorContext } from "../EditorContext";
import { getReviewById } from "../../review/reviewSlice";

const severityConfig = {
  critical: {
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
  },

  warning: {
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },

  info: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
};

const RightPanel = () => {
  const [activeTab, setActiveTab] = useState("review");
  const { review, reviews, isLoading, historyLoading, error } = useSelector((state) => state.review);

  const critical =
    review?.results?.filter((r) => r.severity === "critical").length || 0;

  const warning =
    review?.results?.filter((r) => r.severity === "warning").length || 0;

  const info =
    review?.results?.filter((r) => r.severity === "info").length || 0;

  return (
    <aside
      className="
        w-[350px]
        border-l
        border-zinc-800
        bg-[#111114]
        flex
        flex-col
        custom-scrollbar
      "
    >
      {/* Tabs */}

      <div
        className="
    h-11
    border-b
    border-zinc-800
    flex

  "
      >
        <Tab
          active={activeTab === "review"}
          onClick={() => setActiveTab("review")}
        >
          AI Review
        </Tab>

        <Tab
          active={activeTab === "history"}
          onClick={() => setActiveTab("history")}
        >
          History
        </Tab>
      </div>

      <div className="flex-1 overflow-auto p-4">

        {activeTab === "review" && (
          <div>
            {isLoading && (
          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-xl
              p-4
            "
          >
            <p className="text-zinc-400">Reviewing code...</p>
          </div>
        )}

        {/* Error */}

        {error && (
          <div
            className="
              bg-red-500/10
              border
              border-red-500/20
              rounded-xl
              p-4
              text-red-400
            "
          >
            {error}
          </div>
        )}

        {/* Empty State */}

        {!isLoading && !review && (
          <div
            className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                h-full
                text-zinc-500
              "
          >
            <div className="text-4xl mb-3">🤖</div>

            <h3 className="font-medium">No Review Yet</h3>

            <p className="text-sm mt-2">
              Click Review AI to analyze the current code.
            </p>
          </div>
        )}

        {review && (
          <>
            {/* Score */}

            <div
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-xl
                p-3
                mb-2
              "
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-violet-400">
                  {review.score}
                </div>

                <p className="text-zinc-400 mt-1">Quality Score</p>
              </div>
            </div>

            {/* Summary */}

            <div
              className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-xl
                p-4
                mb-3
              "
            >
              <h3 className="font-medium mb-2">Summary</h3>

              <p className="text-sm text-zinc-400">{review.summary}</p>
            </div>

            {/* Stats */}

            <div className="grid grid-cols-3 gap-2 mb-3">
              <StatCard
                label="Critical"
                value={critical}
                color="text-red-400"
              />

              <StatCard
                label="Warning"
                value={warning}
                color="text-yellow-400"
              />

              <StatCard label="Info" value={info} color="text-blue-400" />
            </div>

            {/* Findings */}

            <div className="space-y-3">
              {review?.results?.map((issue, index) => (
                <IssueCard key={index} issue={issue} />
              ))}
            </div>
          </>
        )}
  
          </div>
        )}

        {activeTab === "history" && (
          <HistoryContent
            reviews={reviews}
            loading={historyLoading}
          />
        )}
          
      </div>


    </aside>
  );
};

const IssueCard = ({ issue }) => {
  const styles = severityConfig[issue.severity];
  const editorRef = useContext(EditorContext);
  const jumpToLine = (line) => {
    const editor = editorRef.current;

    if (!editor || !line) return;

    editor.revealLineInCenter(line);

    editor.setPosition({
      lineNumber: line,
      column: 1,
    });

    editor.focus();
  };

  return (
    <div
      onClick={() => jumpToLine(issue.line)}
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-xl
        cursor-pointer
        p-4
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {issue.line ? `Line ${issue.line}` : "General"}
        </span>

        <span
          className={`
            px-2
            py-1
            rounded-md
            border
            text-xs
            capitalize
            ${styles.badge}
          `}
        >
          {issue.severity}
        </span>
      </div>

      <h4 className="mt-3 font-medium">{issue.message}</h4>

      <p className="text-sm text-zinc-400 mt-2">{issue.suggestion}</p>

      <div className="mt-3 text-xs text-violet-400 capitalize">
        {issue.category}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  return (
    <div
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-xl
        p-3
        text-center
      "
    >
      <div className={`text-xl font-bold ${color}`}>{value}</div>

      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  );
};

const HistoryContent = ({
  reviews,
  loading,
}) => {
  const dispatch =
    useDispatch();

  if (loading) {
    return (
      <p className="text-zinc-400">
        Loading history...
      </p>
    );
  }

  if (
    !reviews ||
    reviews.length === 0
  ) {
    return (
      <div className="text-zinc-500 text-center mt-10">
        No review history
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map(
        (review) => (
          <HistoryCard
            key={review._id}
            review={review}
            onClick={() =>
              dispatch(
                getReviewById(
                  review._id
                )
              )
            }
          />
        )
      )}
    </div>
  );
};

const HistoryCard = ({
  review,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-xl
        p-4
        cursor-pointer
        hover:border-violet-500/50
        transition
      "
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">
          Review
        </span>

        <span
          className="
            px-2
            py-1
            rounded-md
            bg-violet-500/10
            text-violet-400
            text-xs
          "
        >
          {review.score}
        </span>
      </div>

      <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
        {review.summary}
      </p>

      <p className="text-xs text-zinc-500 mt-3">
        {new Date(
          review.createdAt
        ).toLocaleString()}
      </p>
    </div>
  );
};

const Tab = ({
  children,
  active,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1
        text-sm
        font-medium
        transition

        ${
          active
            ? "text-violet-400 border-b-2 border-violet-500"
            : "text-zinc-500 hover:text-zinc-300"
        }
      `}
    >
      {children}
    </button>
  );
};

export default RightPanel;
