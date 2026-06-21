// usePresence.js

import { useEffect } from "react";
import { getSocket } from "../socket";
import { useDispatch } from "react-redux";
import { setOnlineUsers } from "../../../features/session/sessionSlice";

export const usePresence = (sessionId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sessionId) return;

    const socket = getSocket();

    const handlePresence = (users) => {
      dispatch(setOnlineUsers(users));
    };

    socket.on("presence:update", handlePresence);

    return () => {

      socket.off("presence:update", handlePresence);
    };
  }, [sessionId, dispatch]);
};