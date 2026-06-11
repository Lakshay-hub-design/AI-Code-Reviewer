import mongoose from 'mongoose';

const reviewResultSchema = new mongoose.Schema(
  {
    line:       { type: Number, default: 0 },
    severity:   { type: String, enum: ['critical', 'warning', 'info'], default: 'info' },
    message:    { type: String, required: true },
    suggestion: { type: String, default: '' },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    // Snapshot of the code at review time
    code:     { type: String, required: true },
    language: { type: String, required: true },
    results:  [reviewResultSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;