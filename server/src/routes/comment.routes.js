import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { createComment, deleteComment, getComments, resolveComment } from "../controllers/comment.controller.js";

const router = Router();

router.post("/:sessionId", protect, createComment);

router.get("/:sessionId", protect, getComments);

router.patch("/:commentId/resolve", protect, resolveComment);

router.delete("/:commentId/delete", protect, deleteComment);

export default router;