import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccessApprovedNotification = ({ notification, onClick }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={onClick}
      className={`
        p-4
        border-b
        border-zinc-800
        transition-colors
        cursor-pointer

        ${notification.read ? "bg-transparent" : "bg-violet-500/5"}

        hover:bg-zinc-800/40
      `}
    >
      <div className="flex gap-3">
        {!notification.read && (
          <div
            className="
        w-2 h-2
        rounded-full
        bg-violet-500
        mt-2
        flex-shrink-0
      "
          />
        )}
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle size={18} className="text-green-400" />
        </div>

        <div className="flex-1">
          <p className="text-sm text-white">
            Access approved for
            <span className="text-violet-400 ml-1">
              {notification.data.sessionTitle}
            </span>
          </p>

          <button
            onClick={() =>
              navigate(`/session-preview/${notification.data.sessionId}`)
            }
            className="
              mt-3
              px-3 py-1.5
              rounded-lg
              bg-green-500/20
              text-green-400
              text-xs
            "
          >
            Open Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessApprovedNotification;
