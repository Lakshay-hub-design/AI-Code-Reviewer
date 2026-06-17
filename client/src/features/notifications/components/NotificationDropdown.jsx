import { useDispatch, useSelector } from "react-redux";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "../notificationSlice";

import NotificationItem from "./NotificationItem";

const NotificationDropdown = () => {
  const dispatch = useDispatch();

  const {
    notifications,
    unreadCount,
    loading,
  } = useSelector(
    (state) => state.notification
  );

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(
        markNotificationRead(notification._id)
      );
    }
  };

  return (
    <div
      className="
        absolute right-0 mt-3
        w-[420px]
        rounded-2xl
        border border-zinc-800
        bg-[#111114]
        shadow-2xl
        overflow-hidden
        z-50
      "
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">
              Notifications
            </h3>

            <p className="text-xs text-zinc-500 mt-0.5">
              {unreadCount} unread
            </p>
          </div>

          {notifications.length > 0 && unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="
                text-xs
                text-violet-400
                hover:text-violet-300
                transition-colors
              "
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[450px] overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-zinc-500">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-zinc-400">
              No notifications
            </p>

            <p className="text-xs text-zinc-600 mt-1">
              You're all caught up
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;