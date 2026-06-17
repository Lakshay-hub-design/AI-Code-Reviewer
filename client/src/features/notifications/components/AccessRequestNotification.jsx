import { useDispatch } from "react-redux";
import {
  acceptAccessRequest,
  declineAccessRequest,
} from "../notificationSlice";

const AccessRequestNotification = ({ notification, onClick }) => {
  const dispatch = useDispatch();
  const status = notification.status || "pending";
  const handleAccept = async (e) => {
    e.stopPropagation()
    try {
      await dispatch(
        acceptAccessRequest(notification.data.accessRequestId),
      ).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (e) => {
    e.stopPropagation()
    try {
      await dispatch(
        declineAccessRequest(notification.data.accessRequestId),
      ).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-zinc-800 transition-colors cursor-pointer ${
        notification.read ? "bg-transparent" : "bg-violet-500/5"
      }
    hover:bg-zinc-800/40`}
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
        <img
          src={notification.data.requesterAvatar}
          alt=""
          className="w-10 h-10 rounded-full"
        />

        <div className="flex-1">
          <p className="text-sm text-white">
            <span className="font-semibold">
              {notification.data.requesterName}
            </span>{" "}
            requested access to{" "}
            <span className="text-violet-400">
              {notification.data.sessionTitle}
            </span>
          </p>

          {status === "pending" && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAccept}
                className="
                px-3 py-1.5
                rounded-lg
                bg-green-500/20
                text-green-400
                text-xs
              "
              >
                Accept
              </button>

              <button
                onClick={handleDecline}
                className="
                px-3 py-1.5
                rounded-lg
                bg-red-500/20
                text-red-400
                text-xs
              "
              >
                Decline
              </button>
            </div>
          )}
          {status === "approved" && (
            <div
              className="
                mt-3
                inline-flex
                items-center
                px-3 py-1.5
                rounded-lg
                bg-green-500/15
                text-green-400
                text-xs
                font-medium
              "
            >
              ✓ Access Granted
            </div>
          )}

          {status === "declined" && (
            <div
              className="
                mt-3
                inline-flex
                items-center
                px-3 py-1.5
                rounded-lg
                bg-red-500/15
                text-red-400
                text-xs
                font-medium
              "
            >
              ✕ Request Declined
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessRequestNotification;