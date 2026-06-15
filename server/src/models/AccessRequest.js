import mongoose from 'mongoose';

const accessRequestSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined'],
      default: 'pending',
    },
    message: {
      type: String,
      default: '',
      maxlength: 300,
    },
  },
  { timestamps: true }
);

// One request per user per session
accessRequestSchema.index({ session: 1, requester: 1 }, { unique: true });

const AccessRequest = mongoose.model('AccessRequest', accessRequestSchema);
export default AccessRequest;