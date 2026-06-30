import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MessageSquare, X, CheckCircle2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

dayjs.extend(relativeTime);

const LineCommentPanel = ({
  line,
  comments,
  position,
  commentText,
  setCommentText,
  onComment,
  onResolve,
  onDelete,
  onClose,
}) => {
  const currentUser = useSelector((state) => state.auth.user);

  return (
    <div
      className="
        absolute
        z-50
        w-80
        rounded-xl
        border
        border-zinc-800
        bg-[#18181b]
        shadow-2xl
        overflow-hidden
      "
      style={{
        top: position.top,
        left: 48,
      }}
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-zinc-800
          px-4
          py-3
        "
      >
        <div className="flex items-center gap-2">
          <MessageSquare
            size={16}
            className="text-violet-400"
          />

          <div>
            <p className="text-sm font-medium text-white">
              Line {line}
            </p>

            <p className="text-xs text-zinc-500">
              {comments.length === 0
                ? "Add Comment"
                : `${comments.length} Comment${
                    comments.length > 1 ? "s" : ""
                  }`}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Existing comments */}

      {comments.length > 0 && (
        <div
          className="
            max-h-64
            overflow-y-auto
            divide-y
            divide-zinc-800
          "
        >
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4"
            >
              <div className="flex gap-3">
                <img
                  src={comment.author.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {comment.author.displayName ||
                          comment.author.username}
                      </p>

                      <p className="text-xs text-zinc-500">
                        {dayjs(
                          comment.createdAt
                        ).fromNow()}
                      </p>
                    </div>

                    {comment.author._id ===
                      currentUser._id && (
                      <button
                        onClick={() =>
                          onDelete(comment._id)
                        }
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-zinc-300 whitespace-pre-wrap">
                    {comment.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add comment */}

      <div className="border-t border-zinc-800 p-4">
        <textarea
          rows={3}
          value={commentText}
          onChange={(e) =>
            setCommentText(e.target.value)
          }
          placeholder={
            comments.length === 0
              ? "Write a comment..."
              : "Add another comment..."
          }
          className="
            w-full
            resize-none
            rounded-lg
            border
            border-zinc-700
            bg-zinc-900
            p-3
            text-sm
            outline-none
            focus:border-violet-500
          "
        />

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() =>
              comments.length > 0 &&
              onResolve(comments[0]._id)
            }
            disabled={comments.length === 0}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-zinc-700
              px-3
              py-2
              text-sm
              text-zinc-300
              hover:bg-zinc-800
              disabled:opacity-40
            "
          >
            <CheckCircle2 size={16} />

            Resolve
          </button>

          <button
            onClick={onComment}
            className="
              rounded-lg
              bg-violet-600
              px-4
              py-2
              text-sm
              font-medium
              hover:bg-violet-500
            "
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default LineCommentPanel;