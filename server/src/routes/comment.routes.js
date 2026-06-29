import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { createComment, deleteComment, getComments, resolveComment } from "../controllers/comment.controller.js";

const router = Router();

router.post("/sessions/:sessionId/comments", protect, createComment);

router.get("/sessions/:sessionId/comments", protect, getComments);

router.patch("/comments/:commentId/resolve", protect, resolveComment);

router.delete("/comments/:commentId", protect, deleteComment);

export default router;