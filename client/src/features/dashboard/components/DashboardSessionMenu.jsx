import {
  Share2,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
import { useEffect, useRef } from "react";

const DashboardSessionMenu = ({
  onEdit,
  onShare,
  onDelete,
  sessionId,
  onClose,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [onClose]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/join/${sessionId}`
      );

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      ref={menuRef}
      className="
        absolute right-0 top-10 z-50
        w-52
        rounded-2xl
        border border-zinc-800
        bg-[#16161B]
        shadow-xl
        overflow-hidden
      "
    >
      <button
        onClick={() => {
          onShare();
          onClose();
        }}
        className="
          w-full px-4 py-3
          flex items-center gap-3
          text-sm text-zinc-300
          hover:bg-zinc-800
          hover:text-white
          transition
        "
      >
        <Share2 size={15} />
        Share Session
      </button>

      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="
          w-full px-4 py-3
          flex items-center gap-3
          text-sm text-zinc-300
          hover:bg-zinc-800
          hover:text-white
          transition
        "
      >
        <Pencil size={15} />
        Edit Session
      </button>

      <button
        onClick={handleCopyLink}
        className="
          w-full px-4 py-3
          flex items-center gap-3
          text-sm text-zinc-300
          hover:bg-zinc-800
          hover:text-white
          transition
        "
      >
        <Copy size={15} />
        Copy Join Link
      </button>

      <div className="border-t border-zinc-800" />

      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="
          w-full px-4 py-3
          flex items-center gap-3
          text-sm text-red-400
          hover:bg-red-500/10
          transition
        "
      >
        <Trash2 size={15} />
        Delete Session
      </button>
    </div>
  );
};

export default DashboardSessionMenu;