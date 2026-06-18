import {
  Share2,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import ShareSessionModal from "../../session/modals/ShareSessionModal";
import NotificationBell from "../../notifications/components/NotificationBell";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../../notifications/notificationSlice";
import { Link } from "react-router-dom";

const EditorHeader = ({ session }) => {
    const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

const [showShare, setShowShare] = useState(false);

if (!session) return null;
  return (
    <header
      className="
        h-14
        border-b
        border-zinc-800
        bg-[#111114]
        px-5
        flex
        items-center
        justify-between
      "
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <Link to={'/dashboard'} className="font-bold text-violet-400">
          AI Reviewer
        </Link>

        <div className="h-5 w-px bg-zinc-700" />

        <div className="flex items-center gap-2">
          <span className="font-medium">
            {session.title}
          </span>

          <span
            className="
              px-2
              py-0.5
              rounded-md
              text-[10px]
              bg-zinc-800
              text-zinc-400
            "
          >
            {session.isPublic ? "PUBLIC" : "PRIVATE"}
          </span>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-violet-400">
            {session.language}
        </span>

        <span className="text-zinc-500">
            {session.members?.length || 0} Members
        </span>

        <span className="flex items-center gap-1 text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Live
        </span>
    </div>

      {/* Right */}
      <div className="flex items-center gap-4">
       <div className="flex -space-x-2">
            {session.members?.slice(0, 4).map(member => (
                <img
                key={member._id}
                src={member.avatar}
                className="
                    w-8 h-8
                    rounded-full
                    border-2
                    border-[#111114]
                "
                />
            ))}
        </div>

        <button
            onClick={() => setShowShare(true)}
          className="
            px-3 py-1.5
            rounded-lg
            bg-zinc-800
            text-sm
          "
        >
          <Share2 size={14} />
        </button>

        <NotificationBell />

        <Settings size={18} className="text-zinc-400" />

        {showShare  && <ShareSessionModal  session={session} onClose={() => setShowShare(false)}  />}
      </div>
    </header>
  );
};

export default EditorHeader;