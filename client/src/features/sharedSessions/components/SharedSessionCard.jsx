import {
  Globe,
  Lock,
  Clock3,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { languageConfig } from "../../../shared/utils/languageConfig";
import { useNavigate } from "react-router-dom";

const SharedSessionCard = ({
  session,
}) => {
  const navigate = useNavigate()
  const config =
    languageConfig[
      session.language
    ] || languageConfig.javascript;

  return (
    <div
      className="
        bg-[#101013]
        border border-zinc-800
        rounded-3xl
        p-5
        hover:border-violet-500/20
        hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]
        transition-all
      "
    >

      {/* Top */}
      <div className="flex justify-between">

        <div
          className={`
            px-3 py-1
            rounded-lg
            text-xs
            font-semibold
            border
            ${config.bg}
            ${config.border}
            ${config.color}
          `}
        >
          {config.short}
        </div>

        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <Clock3 size={12} />
          {formatDistanceToNow(
            new Date(session.updatedAt),
            { addSuffix: true }
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mt-5">
        {session.title}
      </h3>

      {/* Fake Description */}
      <p className="text-zinc-400 text-sm mt-3 line-clamp-2">
        Collaborative {session.language}
        coding session shared with you.
      </p>

      {/* Owner */}
      <div className="flex items-center gap-3 mt-6">

        <img
          src={session.owner.avatar}
          alt={session.owner.displayName}
          className="w-9 h-9 rounded-full"
        />

        <div>
          <p className="text-sm text-white">
            Shared by {session.owner.displayName}
          </p>

          <p className="text-xs text-zinc-500">
            @{session.owner.username}
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-800 my-5" />

      {/* Bottom */}
      <div className="flex items-center justify-between">

        <div className="flex -space-x-2">

          {session.members
            .slice(0, 3)
            .map((member) => (
              <img
                key={member._id}
                src={member.avatar}
                alt=""
                className="
                  w-8 h-8
                  rounded-full
                  border-2
                  border-[#09090B]
                "
              />
            ))}

          {session.members.length > 3 && (
            <div
              className="
                w-8 h-8
                rounded-full
                bg-zinc-800
                flex items-center justify-center
                text-xs
              "
            >
              +{session.members.length - 3}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/editor/${session._id}`)}
          className="
            px-5 py-2
            rounded-xl
            bg-gradient-to-r
            from-violet-600
            to-purple-500
            text-white
            text-sm
            font-medium
          "
        >
          Open Session
        </button>

      </div>

      {/* Visibility */}
      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">

        {session.isPublic ? (
          <>
            <Globe size={12} />
            Public
          </>
        ) : (
          <>
            <Lock size={12} />
            Private
          </>
        )}

      </div>

    </div>
  );
};

export default SharedSessionCard;