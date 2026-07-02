import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
} from './product.controller';
import { protect, adminOnly } from '../../middleware/authMiddleware';
import { upload } from '../../config/cloudinary';

const router = Router();

// ── Public routes (no login needed) ──────────────────────
router.get('/', getProducts);
router.get('/category/:category', getByCategory);
router.get('/:id', getProduct);

// ── Admin only routes ─────────────────────────────────────
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/images', protect, adminOnly, upload.array('images', 5), uploadImages);

export default router;