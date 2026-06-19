import { Router } from 'express';
import {
  getSessions,
  createSession,
  getSession,
  updateSession,
  deleteSession,
  joinSession,
  previewSession,
  updateCode,
} from '../controllers/session.controller.js';
import protect from '../middleware/auth.middleware.js';
import { requestAccess } from '../controllers/accessRequest.controller.js';

const router = Router();

router.get('/preview/:id', previewSession)

router.use(protect)

router.get('/', getSessions);
router.post('/', createSession);
router.get('/:id', getSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);
router.post('/:id/join', joinSession);

router.patch('/:id/code', updateCode)

export default router;