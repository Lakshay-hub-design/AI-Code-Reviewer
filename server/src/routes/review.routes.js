import express from "express";

import {
  createReview,
  getLatestReview,
  getReviewById,
  getReviewHistory,
} from "../controllers/review.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:sessionId", protect, createReview);

router.get("/:sessionId/latest", protect, getLatestReview);

router.get("/:sessionId/history", protect, getReviewHistory);

router.get("/review/:reviewId", protect, getReviewById)

export default router;