import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

router.post('/register', register);    // POST /api/auth/register
router.post('/login', login);          // POST /api/auth/login
router.get('/me', protect, getMe);     // GET  /api/auth/me  ← protected

export default router;