import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { connectSocket, disconnectSocket } from "../socket/socket";

import { addNotification } from "../../features/notifications/notificationSlice";

import { toast } from "react-hot-toast";
import { playNotificationSound } from "../utils/playNotificationSound";

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) return;
    console.log("SocketProvider mounted");

    const socket = connectSocket();
    socket.on("connect", () => {
        console.log("Connected:", socket.id);
    });
    socket.on("connect_error", (err) => {
        console.log("Socket error:", err.message);
    });
    // Notification Bell
    socket.on("notification:new", ({ notification }) => {
      dispatch(addNotification(notification));
      playNotificationSound()
    });

    // Toasts
    socket.on("access:approved", ({ sessionTitle, notification }) => {
        dispatch(addNotification(notification))
        playNotificationSound()
      toast.success(`Access granted to ${sessionTitle}`);
    });

    socket.on("access:declined", ({ sessionTitle, notification }) => {
        dispatch(addNotification(notification))
        playNotificationSound()
      toast.error(`Access denied for ${sessionTitle}`);
    });

    return () => {
      socket.off("notification:new");
      socket.off("access:approved");
      socket.off("access:declined");
    };
  }, [dispatch, user]);

  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  return children;
};

export default SocketProvider;
