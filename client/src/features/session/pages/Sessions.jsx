import { useDispatch, useSelector } from "react-redux";

import StatsCard from "../components/StatsCard";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import SessionList from "../components/SessionList";
import {
  Layers3,
  Globe,
  Lock,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchSessions } from "../sessionSlice";

const Sessions = () => {
  const dispatch = useDispatch()
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("");
  const [page, setPage] = useState(1);

useEffect(() => {
  dispatch(
    fetchSessions({
      page,
      limit: 10,
      search,
      visibility,
      sort: "recent",
    })
  );
}, [dispatch, page, search, visibility]);
const user = useSelector((state) => state.auth.user);
const sessions = useSelector((state) => state.session.list);

const mySessions = sessions.filter(
  (session) => session.owner._id === user._id
);
  const totalSessions = mySessions.length;

  const publicSessions = mySessions.filter(
    (session) => session.isPublic
  ).length;

  const privateSessions = mySessions.filter(
    (session) => !session.isPublic
  ).length;

  const collaborators = new Set(
    mySessions.flatMap((session) =>
      session.members.map((member) => member._id)
    )
  ).size;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-violet-500/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[130px] rounded-full" />

      <div className="relative z-10 px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Sessions</h1>

            <p className="text-zinc-400 mt-2">
              Manage and organize your coding workspaces and AI-driven reviews.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="TOTAL SESSIONS"
            value={totalSessions}
            
            icon={Layers3}
            accentColor="text-violet-400"
          />

          <StatsCard
            title="PUBLIC SESSIONS"
            value={publicSessions}
            label="Global access"
            icon={Globe}
            accentColor="text-cyan-400"
          />

          <StatsCard
            title="PRIVATE SESSIONS"
            value={privateSessions}
            label="Protected"
            icon={Lock}
            accentColor="text-violet-300"
          />

          <StatsCard
            title="COLLABORATORS"
            value={collaborators}
            icon={Users}
            accentColor="text-cyan-400"
          />
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
          <FilterBar
            visibility={visibility}
            setVisibility={setVisibility}
          />

          <SearchBar
            search={search}
            setSearch={setSearch}
          />
        </div>

        {/* Sessions */}
        <SessionList sessions={mySessions} />
      </div>
    </div>
  );
};

export default Sessions;