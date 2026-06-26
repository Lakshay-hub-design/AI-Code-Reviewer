import Review from "../models/Review.js";
import Session from "../models/Session.js";
import generateAiReview from "../services/ai.service.js";
import { getIo } from "../sockets/index.js";
import { generateCodeHash } from "../utils/hash.utils.js";

export const createReview = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const codeHash = generateCodeHash(session.code);

    const latestReview = await Review.findOne({
      session: sessionId,
      codeHash
    }).sort({
      createdAt: -1
    })

    if(latestReview){
      const io = getIo()

      io.to(`session:${sessionId}`).emit(
        "review-created",
        {
          review: latestReview,
          createdBy: req.user.username,
          cached: true,
        }
      )

      return res.status(200).json({
        success: true,
        cached: true,
        review: latestReview
      })
    }

    const aiReview = await generateAiReview({
      code: session.code,
      language: session.language,
    });

    const review = await Review.create({
      session: session._id,
      code: session.code,
      language: session.language,
      score: aiReview.score,
      summary: aiReview.summary,
      results: aiReview.results,
      codeHash,
      createdBy: req.user.id,
    });

    const io = getIo()

    io.to(`session:${sessionId}`).emit(
      "review-created",
      {
        review,
        createdBy: req.user.username,
      }
    );

    res.status(201).json({
      success: true,
      review,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Failed to generate ai review",
    });
  }
};

export const getLatestReview = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const review = await Review.findOne({
      session: sessionId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      review,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch latest review",
    });
  }
};

export const getReviewHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const reviews = await Review.find({
      session: sessionId,
    })
      .select("score summary createdAt createdBy")
      .populate("createdBy", "username displayName avatar")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      reviews,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch review history",
    });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      review,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch review",
    });
  }
};
