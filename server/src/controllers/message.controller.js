import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      session: req.params.sessionId,
    })
      .populate("sender", "username")
      .sort({
        createdAt: 1,
      });
    res.json({
      success: true,
      messages,
    });
  } catch (err) {
    res.status(500).json({
      messages: "Failed to fetch messages"
    })
  }
};
