import { Request, Response, NextFunction } from 'express';
import * as categoryService from './category.service';

// GET /api/categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeInactive = req.userRole === 'admin' && req.query.all === 'true';
    const categories = await categoryService.getAllCategories(includeInactive);
    res.json(categories);
  } catch (err) { next(err); }
};

// GET /api/categories/:slug
export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cat = await categoryService.getCategoryBySlug(req.params.slug);
    res.json(cat);
  } catch (err) { next(err); }
};

// POST /api/categories
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, sortOrder } = req.body;
    if (!name) { res.status(400).json({ message: 'Category name is required' }); return; }

    const image = req.file ? (req.file as any).path : undefined;

    const cat = await categoryService.createCategory({
      name, description, image,
      sortOrder: sortOrder ? Number(sortOrder) : 0,
    });
    res.status(201).json({ message: 'Category created', category: cat });
  } catch (err) { next(err); }
};

// PUT /api/categories/:id
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, isActive, sortOrder } = req.body;
    const image = req.file ? (req.file as any).path : undefined;

    const cat = await categoryService.updateCategory(req.params.id, {
      name, description, isActive: isActive === 'true' || isActive === true,
      sortOrder: sortOrder ? Number(sortOrder) : undefined,
      ...(image && { image }),
    });
    res.json({ message: 'Category updated', category: cat });
  } catch (err) { next(err); }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};