import Comment from "../models/Comment.js";
import Session from "../models/Session.js";
import { getIo } from "../sockets/index.js";

export const createComment = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { line, text } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const comment = await Comment.create({
      session: sessionId,
      line,
      text,
      author: req.user.id,
    });

    await comment.populate("author", "username displayName avatar");

    getIo().to(`session:${sessionId}`).emit("comment-created", comment);

    res.status(201).json({
      success: true,
      comment,
    });
  } catch(error) {
    console.error("Create Comment:", error);
    res.status(500).json({
      message: "Failed to create comment",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const comments = await Comment.find({
      session: sessionId,
    })
      .populate("author", "username displayName avatar")
      .sort({
        line: 1,
        createdAt: 1,
      });

    res.json({
      success: true,
      comments,
    });
  } catch(error) {
    console.error("Get Comments:", error);
    res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
};

export const resolveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        resolved: true,
      },
      {
        new: true,
      },
    ).populate("author", "username displayName avatar");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment) {
      getIo()
        .to(`session:${comment.session}`)
        .emit("comment-resolved", comment);
    }

    res.json({
      success: true,
      comment,
    });
  } catch(error) {
    console.error("Resolve Comment:", error);
    res.status(500).json({
      message: "Failed to resolve comment",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await comment.deleteOne();

    getIo().to(`session:${comment.session}`).emit("comment-deleted", {
      commentId,
    });

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch(error) {
    console.error("Delete Comment:", error);
    res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};