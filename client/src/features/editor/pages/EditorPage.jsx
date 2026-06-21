import { useParams } from "react-router-dom";
import EditorHeader from "../components/EditorHeader";
import EditorSidebar from "../components/EditorSidebar";
import EditorWorkspace from "../components/EditorWorkspace";
import RightPanel from "../components/RightPanel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSession } from "../../session/sessionSlice";
import { usePresence } from "../../../shared/socket/hooks/usePresence";

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

  usePresence(currentSession?._id)

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