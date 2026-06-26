import {Router} from "express"
import protect from "../middleware/auth.middleware.js"
import { getMessages } from "../controllers/message.controller.js"

const router = Router()

router.get('/:sessionId', protect, getMessages)

export default router