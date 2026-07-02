import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { protect } from '../../middleware/authMiddleware';
import {
  validateRegister,
  validateLogin,
  handleValidation,
} from '../../middleware/sanitize';

const router = Router();

router.post('/register', validateRegister, handleValidation, register);
router.post('/login', validateLogin, handleValidation, login);
router.get('/me', protect, getMe);

export default router;