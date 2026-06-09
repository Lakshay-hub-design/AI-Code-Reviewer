import { Router } from 'express';
import {
  getSessions,
  createSession,
  getSession,
  updateSession,
  deleteSession,
  joinSession,
} from '../controllers/session.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getSessions);
router.post('/', createSession);
router.get('/:id', getSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);
router.post('/:id/join', joinSession);

export default router;