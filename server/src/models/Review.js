import mongoose from "mongoose";

const reviewResultSchema = new mongoose.Schema(
  {
    line: { type: Number, default: 0 },
    severity: {
      type: String,
      enum: ["critical", "warning", "info"],
      default: "info",
    },
    category: {
      type: String,
      enum: [
        "security",
        "performance",
        "maintainability",
        "bug",
        "best-practice",
      ],
      default: "best-practice",
    },
    message: { type: String, required: true },
    suggestion: { type: String, default: "" },
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    summary: {
      type: String,
      default: "",
    },
    // Snapshot of the code at review time
    code: { type: String, required: true },
    language: { type: String, required: true },
    results: [reviewResultSchema],
    codeHash: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
