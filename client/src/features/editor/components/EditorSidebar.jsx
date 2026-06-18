import { useState } from "react";
import {
  Users,
  MessageSquare,
  History,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useSelector } from "react-redux";

const EditorSidebar = ({ session }) => {
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
          <h3 className="text-sm font-semibold text-white">
            Session Tools
          </h3>
        )}

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
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
              onClick={() =>
                setActiveTab(tab.id)
              }
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

              {!collapsed && (
                <span className="text-sm">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!collapsed && (
        <>
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {activeTab === "members" && (
              <MembersPanel session={session} />
            )}

            {activeTab === "chat" && (
              <ChatPanel />
            )}

            {activeTab === "activity" && (
              <ActivityPanel />
            )}
          </div>

          {/* Chat Input */}
          {activeTab === "chat" && (
            <div
              className="
                border-t
                border-zinc-800
                p-3
              "
            >
              <input
                placeholder="Type a message..."
                className="
                  w-full
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                  outline-none
                  focus:border-violet-500
                "
              />
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
  const onlineUsers = useSelector(
    (state) => state.session.onlineUsers
  );

  const owner = session?.owner;

  const onlineSet = new Set(onlineUsers);

  const nonOwnerMembers =
    session?.members?.filter(
      (member) =>
        member._id.toString() !==
        owner?._id?.toString()
    ) || [];

  const totalMembers =
    (nonOwnerMembers?.length || 0) +
    (owner ? 1 : 0);

  return (
    <div className="pt-3">
      <div className="mb-4">
        <h4 className="text-xs uppercase tracking-wider text-zinc-500">
          Members
        </h4>

        <p className="text-xs text-zinc-600 mt-1">
          {onlineUsers.length} Online •{" "}
          {totalMembers} Total
        </p>
      </div>

      <div className="space-y-2">
        {owner && (
          <MemberItem
            user={owner}
            owner
            online={onlineSet.has(owner._id)}
          />
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

const MemberItem = ({
  user,
  owner = false,
  online = false,
}) => {
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
          <img
            src={user.avatar}
            alt=""
            className="w-8 h-8 rounded-full"
          />

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

              ${
                online
                  ? "bg-green-400"
                  : "bg-zinc-600"
              }
            `}
          />
        </div>

        <div>
          <p className="text-sm text-white">
            {user.displayName ||
              user.username}
          </p>

          <div className="flex items-center gap-2">
            {owner && (
              <span className="text-xs text-violet-400">
                Owner
              </span>
            )}

            <span
              className={`
                text-xs
                ${
                  online
                    ? "text-green-400"
                    : "text-zinc-500"
                }
              `}
            >
              {online
                ? "Online"
                : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Chat ---------------- */

const ChatPanel = () => {
  return (
    <div className="pt-3 space-y-3">
      <div className="text-xs text-zinc-500 text-center">
        No messages yet
      </div>
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