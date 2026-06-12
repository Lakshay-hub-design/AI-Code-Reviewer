import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    code: {
      type: String,
      default: '// Start coding here...',
    },
    language: {
      type: String,
      default: 'javascript',
      enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'html', 'css'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-update lastEditedAt when code changes
sessionSchema.pre('save', function () {
  if (this.isModified('code')) {
    this.lastEditedAt = new Date();
  }
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;