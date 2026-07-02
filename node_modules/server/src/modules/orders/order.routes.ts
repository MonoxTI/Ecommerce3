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

const router = Router();

// ── Customer routes ───────────────────────────────────────
router.use(protect); // all order routes require login

router.post('/', placeOrder);                    // POST   /api/orders
router.get('/', getUserOrders);                  // GET    /api/orders
router.get('/:id', getOrder);                    // GET    /api/orders/:id
router.put('/:id/cancel', cancelOrder);          // PUT    /api/orders/:id/cancel

// ── Admin routes ──────────────────────────────────────────
router.get('/admin/all', adminOnly, getAllOrders);           // GET /api/orders/admin/all
router.put('/admin/:id', adminOnly, updateOrderStatus);     // PUT /api/orders/admin/:id

export default router;