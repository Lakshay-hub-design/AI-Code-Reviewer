import { Bell } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  const unreadCount = useSelector(
    (state) => state.notification.unreadCount
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-zinc-800 transition"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              min-w-[18px] h-[18px]
              px-1
              rounded-full
              bg-red-500
              text-[10px]
              flex items-center justify-center
              font-semibold
            "
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;