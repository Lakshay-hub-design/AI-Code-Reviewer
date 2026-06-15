import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { getNotifications, markAllRead, markOneRead } from "../controllers/notification.controller.js";

const router = Router()
router.use(protect)

router.get('/', getNotifications)
router.patch('/read-all', markAllRead)
router.patch('/:id/read', markOneRead)

export default router