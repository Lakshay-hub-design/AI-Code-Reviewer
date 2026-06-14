import { useSelector } from "react-redux";
import {
  Users,
  UserRound,
  Globe,
  Share2,
} from "lucide-react";

import StatsCard from "../../session/components/StatsCard";
import SharedSessionCard from "../components/SharedSessionCard";
import { useState } from "react";
import JoinSessionModal from "../components/JoinSessionModal";

const SharedWithMe = () => {
  const [showJoin, setShowJoin] = useState(false)
  const sessions = useSelector(
    (state) => state.session.list
  );

  const user = useSelector(
    (state) => state.auth.user
  );

  const sharedSessions = sessions.filter(
    (session) =>
      session.owner._id !== user._id
  );

  const uniqueOwners = new Set(
    sharedSessions.map(
      (session) => session.owner._id
    )
  ).size;

  const collaborators = new Set(
    sharedSessions.flatMap((session) =>
      session.members.map(
        (member) => member._id
      )
    )
  ).size;

  const publicSessions =
    sharedSessions.filter(
      (session) => session.isPublic
    ).length;

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 blur-[140px]" />

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px]" />

      <div className="relative z-10 px-8 py-6">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">

          <div>
            <h1 className="text-3xl font-bold text-white">
              Shared With Me
            </h1>

            <p className="text-zinc-400 mt-2">
              Collaborate on coding sessions shared by teammates and contributors.
            </p>
          </div>

          <button
          onClick={() => setShowJoin(true)}
            className="
              px-6 py-3
              rounded-xl
              bg-gradient-to-r
              from-violet-600
              to-purple-500
              text-white
              font-medium
              shadow-[0_0_25px_rgba(168,85,247,0.3)]
            "
          >
            Join Session
          </button>
        </div>

        {showJoin && <JoinSessionModal onClose={() => setShowJoin(false)} />}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">

          <StatsCard
            title="SHARED SESSIONS"
            value={sharedSessions.length}
            label="Sessions"
            icon={Share2}
            accentColor="text-violet-400"
          />

          <StatsCard
            title="UNIQUE OWNERS"
            value={uniqueOwners}
            label="Owners"
            icon={UserRound}
            accentColor="text-cyan-400"
          />

          <StatsCard
            title="ACTIVE COLLABORATORS"
            value={collaborators}
            label="Members"
            icon={Users}
            accentColor="text-orange-400"
          />

          <StatsCard
            title="PUBLIC SESSIONS"
            value={publicSessions}
            label="Visible"
            icon={Globe}
            accentColor="text-violet-300"
          />

        </div>

        <div className="grid grid-cols-3 gap-6">
          {sharedSessions.map((session) => (
            <SharedSessionCard
              key={session._id}
              session={session}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default SharedWithMe;