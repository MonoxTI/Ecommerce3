import { Router } from 'express';
import {
  placeOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from './order.controller';
import { protect, adminOnly } from '../../middleware/authMiddleware';
import { validateOrder, handleValidation } from '../../middleware/sanitize';

const router = Router();

router.use(protect);

router.post('/', validateOrder, handleValidation, placeOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

router.get('/admin/all', adminOnly, getAllOrders);
router.put('/admin/:id', adminOnly, updateOrderStatus);

export default router;