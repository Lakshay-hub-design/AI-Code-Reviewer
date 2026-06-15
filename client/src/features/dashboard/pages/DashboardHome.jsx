import SharedSessionCard from "../components/SharedSessionCard";
import { useDispatch, useSelector } from "react-redux";
import SessionCard from "../components/SessionCard";
import { fetchSessions } from "../../session/sessionSlice";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteSessionModal from "../../session/modals/DeleteSessionModal";
import ShareSessionModal from "../../session/modals/ShareSessionModal";
import EditSessionModal from "../../session/modals/EditSessionModal";

const DashboardHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedSession, setSelectedSession] = useState(null);

  const [showEdit, setShowEdit] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const {
    list: sessions,
    loading,
    error,
  } = useSelector((state) => state.session);
  useEffect(() => {
    dispatch(
      fetchSessions({
        page: 1,
        limit: 10,
        search: "",
        visibility: "",
        sort: "recent",
      }),
    );
  }, [dispatch]);

  const user = useSelector((state) => state.auth.user);
  const mySessions = sessions.filter((s) => s.owner?._id === user?._id);
  const sharedSessions = sessions.filter((s) => s.owner?._id !== user?._id);

  const openEditModal = (session) => {
    setSelectedSession(session);
    setShowEdit(true);
  };

  const openShareModal = (session) => {
    setSelectedSession(session);
    setShowShare(true);
  };

  const openDeleteModal = (session) => {
    setSelectedSession(session);
    setShowDelete(true);
  };

  return (
    <main className="flex-1 px-8 py-6">
      <div>
        <h1 className="text-4xl font-bold mb-3">Your Coding Sessions</h1>

        <p className="text-zinc-400 text-sm">
          Collaborate in real-time with AI-powered insights. Review, refactor
          and ship high-quality code.
        </p>
      </div>

      <section className="mt-7">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Sessions</h2>
          <button
            onClick={() => navigate("/sessions")}
            className="text-violet-400 hover:text-violet-300"
          >
            View all sessions
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 text-zinc-400 py-12 justify-center">
            <Loader2 size={20} className="animate-spin" />
            <span>Loading sessions...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-400 text-sm">
            Failed to load sessions: {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && mySessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
              <span className="text-violet-400 text-2xl font-mono">&gt;_</span>
            </div>
            <p className="text-zinc-300 font-medium mb-1">No sessions yet</p>
            <p className="text-zinc-500 text-sm">
              Create your first session to start collaborating
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && mySessions.length > 0 && (
          <div className="grid grid-cols-4 gap-6">
            {mySessions.map((session) => (
              <SessionCard
                key={session._id}
                project={session}
                onEdit={openEditModal}
                onShare={openShareModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Shared With Me</h2>
          <button
            onClick={() => navigate("/shared")}
            className="text-violet-400 hover:text-violet-300"
          >
            View all Shared Sessions
          </button>
        </div>

        <div className="space-y-3">
          {sharedSessions.map((session) => (
            <SharedSessionCard key={session._id} sharedSession={session} />
          ))}
        </div>
      </section>
      {showEdit && selectedSession && (
        <EditSessionModal
          session={selectedSession}
          onClose={() => {
            setShowEdit(false);
            setSelectedSession(null);
          }}
        />
      )}

      {showShare && selectedSession && (
        <ShareSessionModal
          session={selectedSession}
          onClose={() => {
            setShowShare(false);
            setSelectedSession(null);
          }}
        />
      )}

      {showDelete && selectedSession && (
        <DeleteSessionModal
          session={selectedSession}
          onClose={() => {
            setShowDelete(false);
            setSelectedSession(null);
          }}
        />
      )}
    </main>
  );
};

export default DashboardHome;
