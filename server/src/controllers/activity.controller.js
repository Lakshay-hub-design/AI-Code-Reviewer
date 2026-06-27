import Activity from "../models/Activity.js";
import Session from "../models/Session.js";

export const getActivities = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const activities = await Activity.find({
      session: sessionId,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch activities",
    });
  }
};