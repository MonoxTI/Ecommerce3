import { Router } from 'express';
import {
  getCategories, getCategory,
  createCategory, updateCategory, deleteCategory,
} from './category.controller';
import { protect, adminOnly } from '../../middleware/authMiddleware';
import { upload } from '../../config/cloudinary';

const router = Router();

// Public
router.get('/', getCategories);
router.get('/:slug', getCategory);

// Admin only
router.post('/', protect, adminOnly, upload.single('image'), createCategory);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;