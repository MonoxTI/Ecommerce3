import { Router } from 'express';
import { getTracking, addEvent } from './tracking.controller';
import { protect, adminOnly } from '../../middleware/authMiddleware';

const router = Router();

router.get('/:orderId', protect, getTracking);
router.post('/:orderId', protect, adminOnly, addEvent);

export default router;