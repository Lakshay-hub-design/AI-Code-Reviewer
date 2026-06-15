import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['access_request', 'access_approved', 'access_declined'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    // Embedded snapshot so notification makes sense even if session is deleted
    data: {
      sessionId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
      sessionTitle:  String,
      requesterId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      requesterName: String,
      requesterAvatar: String,
      accessRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'AccessRequest' },
    },
  },
  { timestamps: true }
);

// Auto-delete notifications older than 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;