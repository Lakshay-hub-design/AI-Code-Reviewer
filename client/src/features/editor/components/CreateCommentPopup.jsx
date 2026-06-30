const CreateCommentPopup = ({
  position,
  commentText,
  setCommentText,
  onComment,
  onCancel,
}) => {
  return (
    <div
      className="
        absolute
        left-12
        z-30
        w-72
        rounded-xl
        border
        border-zinc-700
        bg-[#18181b]
        p-3
        shadow-2xl
      "
      style={{
        top: position.top,
      }}
    >
      <h3 className="mb-3 text-sm font-semibold text-white">
        Add Comment
      </h3>

      <textarea
        rows={4}
        value={commentText}
        onChange={(e) =>
          setCommentText(e.target.value)
        }
        placeholder="Write your comment..."
        className="
          w-full
          rounded-lg
          border
          border-zinc-700
          bg-zinc-900
          p-2
          text-sm
          text-white
          outline-none
          focus:border-violet-500
          resize-none
        "
      />

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="
            rounded-lg
            px-3
            py-1.5
            text-sm
            text-zinc-400
            hover:bg-zinc-800
          "
        >
          Cancel
        </button>

        <button
          onClick={onComment}
          disabled={!commentText.trim()}
          className="
            rounded-lg
            bg-violet-600
            px-4
            py-1.5
            text-sm
            text-white
            hover:bg-violet-700
            disabled:opacity-50
          "
        >
          Comment
        </button>
      </div>
    </div>
  );
};

export default CreateCommentPopup;