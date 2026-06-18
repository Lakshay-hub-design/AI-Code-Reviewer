import { useParams } from "react-router-dom";
import EditorHeader from "../components/EditorHeader";
import EditorSidebar from "../components/EditorSidebar";
import EditorWorkspace from "../components/EditorWorkspace";
import RightPanel from "../components/RightPanel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSession, setOnlineUsers, setRemoteCursor } from "../../session/sessionSlice";
import { connectSocket } from "../../../shared/socket/socket";

const EditorPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentSession, fetchLoading } = useSelector(
    (state) => state.session
  );

  useEffect(() => {
    if (id) {
        
      dispatch(fetchSession(id));
    }
  }, [dispatch, id]);

  const socket = connectSocket();

useEffect(() => {
  if (!currentSession) return;

  socket.emit("join-session", {
    sessionId: currentSession._id,
  });

  socket.on(
    "presence:update",
    (userIds) => {
      dispatch(
        setOnlineUsers(userIds)
      );
    }
  );

  return () => {
    socket.emit("leave-session", {
      sessionId: currentSession._id,
    });

    socket.off("presence:update");
  };
}, [currentSession, dispatch]);

useEffect(() => {
  if (!currentSession) return;

  socket.on(
    "cursor-update",
    (cursor) => {
      dispatch(
        setRemoteCursor(cursor)
      );
    }
  );

  return () => {
    socket.off(
      "cursor-update"
    );
  };
}, [currentSession]);
  if (fetchLoading || !currentSession) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Session...
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#09090B] text-white flex flex-col overflow-hidden">
      <EditorHeader session={currentSession} />

      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar session={currentSession} />

        <EditorWorkspace session={currentSession} />

        <RightPanel session={currentSession} />
      </div>
    </div>
  );
};

export default EditorPage;