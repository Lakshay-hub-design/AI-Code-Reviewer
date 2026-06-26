import {
  Users,
  MessageSquare,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  SendHorizontal,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {
  fetchMessages,
  addMessage,
  typingStopped,
  typingStarted,
} from "../../chat/chatSlice";
import { getSocket } from "../../../shared/socket/socket";

const EditorSidebar = ({ session }) => {
  const currentUser = useSelector((state) => state.auth.user)
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("members");

  const tabs = [
    {
      id: "members",
      label: "Members",
      icon: Users,
    },
    {
      id: "chat",
      label: "Chat",
      icon: MessageSquare,
    },
    {
      id: "activity",
      label: "Activity",
      icon: History,
    },
  ];

  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const typingRef = useRef(false);
  const timeoutRef = useRef();

  const { typingUsers } = useSelector(
  state => state.chat
);

  useEffect(() => {
    if (activeTab === "chat") {
      dispatch(fetchMessages(session._id));
    }
  }, [activeTab, session._id, dispatch]);

  useEffect(() => {
    const socket = getSocket();

    const handleMessage = (message) => {
      dispatch(addMessage(message));
    };

    socket.on("chat-message", handleMessage);

    socket.on("typing-start", ({ socketId, user }) => {
      dispatch(
        typingStarted({
          socketId,
          user,
        }),
      );
    });

    socket.on("typing-stop", ({ socketId }) => {
      dispatch(
        typingStopped({
          socketId,
        }),
      );
    });

    return () => {
      socket.off("chat-message", handleMessage);
      socket.off("typing-start");
      socket.off("typing-stop");
    };
  }, [dispatch]);

  const sendMessage = () => {
    if (!message.trim()) return;

    getSocket().emit("chat-message", {
      sessionId: session._id,
      text: message.trim(),
    });
    typingRef.current = false;

    clearTimeout(timeoutRef.current);

    getSocket().emit("typing-stop", {
      sessionId: session._id,
    });

    setMessage("");
  };

  return (
    <aside
      className={`
        bg-[#111114]
        border-r
        border-zinc-800
        transition-all
        duration-300
        flex
        flex-col
        ${collapsed ? "w-16" : "w-80"}
      `}
    >
      {/* Header */}
      <div
        className="
          h-14
          border-b
          border-zinc-800
          flex
          items-center
          justify-between
          px-4
        "
      >
        {!collapsed && (
          <h3 className="text-sm font-semibold text-white">Session Tools</h3>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            text-zinc-500
            hover:text-white
            transition-colors
          "
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="p-2 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-xl
                transition-all

                ${
                  activeTab === tab.id
                    ? "bg-violet-500/15 text-violet-400"
                    : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                }
              `}
            >
              <Icon size={18} />

              {!collapsed && <span className="text-sm">{tab.label}</span>}
            </button>
          );
        })}
      </div>

      {!collapsed && (
        <>
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 custom-scrollbar">
            {activeTab === "members" && <MembersPanel session={session} />}

            {activeTab === "chat" && <ChatPanel />}

            {activeTab === "activity" && <ActivityPanel />}
          </div>

          {typingUsers.length > 0 && (
  <div className="px-2 pb-2">
    <p className="text-xs text-zinc-500 italic">
      {typingUsers
        .map(u => u.user.username)
        .join(", ")}{" "}
      {typingUsers.length > 1
        ? "are typing..."
        : "is typing..."}
    </p>
  </div>
)}

          {/* Chat Input */}
          {activeTab === "chat" && (
            <div className="border-t border-zinc-800 p-3 bg-[#111114]">
              <div
                className="
        flex
        items-end
        gap-2
        rounded-2xl
        border
        border-zinc-700
        bg-zinc-900
        p-2
        focus-within:border-violet-500
        transition-colors
      "
              >
                <input
                  value={message}
                  onChange={(e) => {
  setMessage(e.target.value);

  if (!typingRef.current) {
    typingRef.current = true;

    getSocket().emit("typing-start", {
      sessionId: session._id,
      user: {
        id: currentUser._id,
        username: currentUser.username,
      },
    });
  }

  clearTimeout(timeoutRef.current);

  timeoutRef.current = setTimeout(() => {
    typingRef.current = false;

    getSocket().emit("typing-stop", {
      sessionId: session._id,
    });
  }, 1000);
}}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="
          flex-1
          bg-transparent
          px-2
          py-2
          text-sm
          text-white
          placeholder:text-zinc-500
          outline-none
        "
                />

                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="
          h-10
          w-10
          rounded-xl
          bg-violet-600
          hover:bg-violet-700
          disabled:bg-zinc-800
          disabled:text-zinc-600
          disabled:cursor-not-allowed
          flex
          items-center
          justify-center
          transition-all
        "
                >
                  <SendHorizontal size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
};

export default EditorSidebar;

/* ---------------- Members ---------------- */

const MembersPanel = ({ session }) => {
  const onlineUsers = useSelector((state) => state.session.onlineUsers);

  const owner = session?.owner;

  const onlineSet = new Set(onlineUsers);

  const nonOwnerMembers =
    session?.members?.filter(
      (member) => member._id.toString() !== owner?._id?.toString(),
    ) || [];

  const totalMembers = (nonOwnerMembers?.length || 0) + (owner ? 1 : 0);

  return (
    <div className="pt-3">
      <div className="mb-4">
        <h4 className="text-xs uppercase tracking-wider text-zinc-500">
          Members
        </h4>

        <p className="text-xs text-zinc-600 mt-1">
          {onlineUsers.length} Online • {totalMembers} Total
        </p>
      </div>

      <div className="space-y-2">
        {owner && (
          <MemberItem user={owner} owner online={onlineSet.has(owner._id)} />
        )}

        {nonOwnerMembers.map((member) => (
          <MemberItem
            key={member._id}
            user={member}
            online={onlineSet.has(member._id)}
          />
        ))}
      </div>
    </div>
  );
};

const MemberItem = ({ user, owner = false, online = false }) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        p-2
        rounded-xl
        hover:bg-zinc-900
      "
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />

          <span
            className={`
              absolute
              bottom-0
              right-0
              w-3
              h-3
              rounded-full
              border-2
              border-[#111114]

              ${online ? "bg-green-400" : "bg-zinc-600"}
            `}
          />
        </div>

        <div>
          <p className="text-sm text-white">
            {user.displayName || user.username}
          </p>

          <div className="flex items-center gap-2">
            {owner && <span className="text-xs text-violet-400">Owner</span>}

            <span
              className={`
                text-xs
                ${online ? "text-green-400" : "text-zinc-500"}
              `}
            >
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Chat ---------------- */

const ChatPanel = () => {
  const { messages, loading } = useSelector((state) => state.chat);

  const currentUser = useSelector((state) => state.auth.user);
  

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (loading) {
    return <div className="pt-3 text-zinc-400">Loading...</div>;
  }

  if (!messages.length) {
    return (
      <div className="pt-3 text-zinc-500 text-center">No messages yet</div>
    );
  }

  const MessageBubble = ({ message, own }) => {
    return (
      <div className={`flex ${own ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[85%] rounded-xl px-3 py-2 ${
            own ? "bg-violet-600" : "bg-zinc-800"
          }`}
        >
          {!own && (
            <p className="text-xs text-violet-400 mb-1">
              {message.sender.username}
            </p>
          )}

          <p className="text-sm break-words">{message.text}</p>

          <p className="text-[10px] text-zinc-400 mt-1">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-3 space-y-3">
      {messages.map((message) => {
        const own = message.sender._id === currentUser._id;

        return <MessageBubble key={message._id} message={message} own={own} />;
      })}

      <div ref={bottomRef} />
    </div>
  );
};

/* ---------------- Activity ---------------- */

const ActivityPanel = () => {
  const activities = [
    "John joined session",
    "Code updated",
    "AI review generated",
    "Sarah left session",
  ];

  return (
    <div className="pt-3">
      <h4 className="text-xs uppercase tracking-wider text-zinc-500 mb-4">
        Activity
      </h4>

      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="
              text-sm
              text-zinc-400
              border-l
              border-violet-500/30
              pl-3
            "
          >
            {activity}
          </div>
        ))}
      </div>
    </div>
  );
};
