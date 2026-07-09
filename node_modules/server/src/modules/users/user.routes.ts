import { Router } from 'express';
import {
  getAllUsers,
  getUserStats,
  getUser,
  updateProfile,
  updateRole,
  deleteUser,
} from './user.controller';
import { protect, adminOnly } from '../../middleware/authMiddleware';

const router = Router();

// ── Logged in user ────────────────────────────────────────
router.put('/profile', protect, updateProfile);

// ── Admin only ────────────────────────────────────────────
router.get('/', protect, adminOnly, getAllUsers);
router.get('/stats', protect, adminOnly, getUserStats);
router.get('/:id', protect, adminOnly, getUser);
router.put('/:id/role', protect, adminOnly, updateRole);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;