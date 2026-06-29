import Activity from "../models/Activity.js";
import { getIo } from "../sockets/index.js";

export const createActivity = async ({
  session,
  user,
  username,
  type,
  message,
  metadata = {},
}) => {
  const activity = await Activity.create({
    session,
    user,
    username,
    type,
    message,
    metadata,
  });

  await activity.populate(
    "user",
    "username displayName avatar"
  );

  const io = getIo()

  io.to(`session:${session}`).emit(
    "activity-created",
    activity
  );

  return activity;
};