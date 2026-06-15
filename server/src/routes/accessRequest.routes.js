import { Router } from "express";
import { acceptRequest, declineRequest, requestAccess } from "../controllers/accessRequest.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router()
router.use(protect)

router.post('/:id/request-access', requestAccess)
router.post('/:id/accept', acceptRequest)
router.post('/:id/decline', declineRequest)

export default router