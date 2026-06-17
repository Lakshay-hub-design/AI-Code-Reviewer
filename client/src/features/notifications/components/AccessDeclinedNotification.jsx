import { XCircle } from "lucide-react";

const AccessDeclinedNotification = ({ notification, onClick }) => {
  return (
    <div
        onClick={onClick}
        className={`
          p-4
          border-b
          border-zinc-800
          transition-colors
          cursor-pointer

          ${
            notification.read
              ? "bg-transparent"
              : "bg-violet-500/5"
          }

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
        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
          <XCircle
            size={18}
            className="text-red-400"
          />
        </div>

        <div>
          <p className="text-sm text-white">
            Access request denied for
            <span className="text-red-400 ml-1">
              {notification.data.sessionTitle}
            </span>
          </p>

          <p className="text-xs text-zinc-500 mt-1">
            You can contact the owner and try again later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDeclinedNotification;