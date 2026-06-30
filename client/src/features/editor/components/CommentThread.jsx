import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CommentThread = ({
  comments,
  position,
  onClose,
  onResolve,
  onDelete,
}) => {
  return (
    <div
      className="
        absolute
        left-12
        z-30
        w-80
        rounded-xl
        border
        border-zinc-700
        bg-[#18181b]
        shadow-2xl
      "
      style={{
        top: position.top,
      }}
    >
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
        <h3 className="font-medium text-white">
          Comments
        </h3>

        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="
              border-b
              border-zinc-800
              p-4
            "
          >
            <div className="flex items-center gap-3">
              <img
                src={comment.author.avatar}
                alt=""
                className="h-8 w-8 rounded-full"
              />

              <div>
                <div className="text-sm font-medium text-white">
                  {comment.author.displayName ||
                    comment.author.username}
                </div>

                <div className="text-xs text-zinc-500">
                  {dayjs(comment.createdAt).fromNow()}
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-300 whitespace-pre-wrap">
              {comment.text}
            </p>

            {!comment.resolved && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    onResolve(comment._id)
                  }
                  className="
                    rounded-lg
                    bg-green-600
                    px-3
                    py-1
                    text-xs
                    text-white
                  "
                >
                  Resolve
                </button>

                <button
                  onClick={() =>
                    onDelete(comment._id)
                  }
                  className="
                    rounded-lg
                    bg-red-600
                    px-3
                    py-1
                    text-xs
                    text-white
                  "
                >
                  Delete
                </button>
              </div>
            )}

            {comment.resolved && (
              <span
                className="
                  mt-3
                  inline-block
                  rounded-full
                  bg-green-500/20
                  px-2
                  py-1
                  text-xs
                  text-green-400
                "
              >
                ✓ Resolved
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentThread;