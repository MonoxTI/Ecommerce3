import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from './cart.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

// All cart routes require login
router.use(protect);

router.get('/', getCart);               // GET    /api/cart
router.post('/', addToCart);            // POST   /api/cart
router.put('/item', updateCartItem);    // PUT    /api/cart/item
router.delete('/item', removeFromCart); // DELETE /api/cart/item
router.delete('/', clearCart);          // DELETE /api/cart

export default router;