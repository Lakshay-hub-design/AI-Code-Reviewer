import { Router } from 'express';
import {
  getSessions,
  createSession,
  getSession,
  updateSession,
  deleteSession,
  joinSession,
  previewSession,
} from '../controllers/session.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.get('/preview/:id', previewSession)

router.get('/', protect, getSessions);
router.post('/', protect, createSession);
router.get('/:id', protect, getSession);
router.put('/:id', protect, updateSession);
router.delete('/:id', protect, deleteSession);
router.post('/:id/join', protect, joinSession);

export default router;