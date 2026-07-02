import { Router } from 'express';
import {
  initializePaystack,
  paystackWebhook,
  verifyPaystack,
  initializeOzow,
  ozowWebhook,
  getOrderPayments,
} from './payment.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

// ── Paystack ──────────────────────────────────────────────
router.post('/paystack/initialize', protect, initializePaystack);
router.post('/paystack/webhook', paystackWebhook);          // no auth — called by Paystack
router.get('/paystack/verify/:reference', protect, verifyPaystack);

// ── Ozow ──────────────────────────────────────────────────
router.post('/ozow/initialize', protect, initializeOzow);
router.post('/ozow/webhook', ozowWebhook);                  // no auth — called by Ozow

// ── General ───────────────────────────────────────────────
router.get('/order/:orderId', protect, getOrderPayments);

export default router;