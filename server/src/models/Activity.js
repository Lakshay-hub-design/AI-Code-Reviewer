import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    username: String,

    type: {
      type: String,
      enum: [
        "join",
        "leave",
        "review",
        "chat",
        "review-selected",
      ],
      required: true,
    },

    message: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Activity", activitySchema);