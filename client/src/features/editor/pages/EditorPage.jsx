import { useParams } from "react-router-dom";
import EditorHeader from "../components/EditorHeader";
import EditorSidebar from "../components/EditorSidebar";
import EditorWorkspace from "../components/EditorWorkspace";
import RightPanel from "../components/RightPanel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSession } from "../../session/sessionSlice";
import { usePresence } from "../../../shared/socket/hooks/usePresence";
import {
  getLatestReview,
  getReviewHistory,
  setReview,
} from "../../review/reviewSlice";
import { useRef } from "react";
import { EditorContext } from "../EditorContext";
import { getSocket } from "../../../shared/socket/socket";
import toast from "react-hot-toast"
import { fetchActivities } from "../../activity/activitySlice";
import { useActivitySocket } from "../../activity/useActivitySocket";
import { fetchComments } from "../../comments/commentSlice";
import { clearComments } from "../../comments/commentSlice";


const EditorPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const { currentSession, fetchLoading } = useSelector(
    (state) => state.session,
  );

  useEffect(() => {
    if (id) {
      dispatch(clearComments());
      
      dispatch(fetchSession(id));
      dispatch(getLatestReview(id));
      dispatch(getReviewHistory(id));
      dispatch(fetchActivities(id));
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);


  useEffect(() => {
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch]);

  useEffect(() => {
    const socket = getSocket();

    const handleReviewCreated = ({review, createdBy, cached}) => {
      console.log(cached)
      dispatch(setReview(review));

      if (cached) {
        toast.success(
          `${createdBy} opened a cached review`
        );
      } else {
        toast.success(
          `${createdBy} generated a review`
        );
      }
    };

    socket.on("review-created", handleReviewCreated);

    return () => {
      socket.off("review-created", handleReviewCreated);
    };
  }, [dispatch]);

  usePresence(currentSession?._id);
  useActivitySocket();

  if (fetchLoading || !currentSession) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Session...
      </div>
    );
  }

  return (
    <EditorContext.Provider value={editorRef}>
      <div className="h-screen bg-[#09090B] text-white flex flex-col overflow-hidden">
        <EditorHeader session={currentSession} />

        <div className="flex flex-1 overflow-hidden">
          <EditorSidebar session={currentSession} />

          <EditorWorkspace session={currentSession} />

          <RightPanel session={currentSession} />
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default EditorPage;
