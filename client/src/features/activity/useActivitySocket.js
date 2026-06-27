import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSocket } from "../../shared/socket/socket";
import { addActivity } from "./activitySlice";

export const useActivitySocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();

    const handleActivity = (activity) => {
      dispatch(addActivity(activity));
    };

    socket.on(
      "activity-created",
      handleActivity
    );

    return () => {
      socket.off(
        "activity-created",
        handleActivity
      );
    };
  }, [dispatch]);
};