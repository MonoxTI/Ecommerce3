import { Request, Response, NextFunction } from 'express';
import * as productService from './product.service';

// ── GET /api/products ─────────────────────────────────────
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, minPrice, maxPrice, size, color, search, page, limit } = req.query;

    const result = await productService.getAllProducts({
      category: category as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      size: size as string,
      color: color as string,
      search: search as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/products/:id ─────────────────────────────────
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/products/category/:category ──────────────────
export const getByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getProductsByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/products ────────────────────────────────────
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, description, price, comparePrice,
      category, subcategory, stock, sku,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !stock || !sku) {
      res.status(400).json({
        message: 'Missing required fields',
        missing: {
          name: !name,
          description: !description,
          price: !price,
          category: !category,
          stock: !stock,
          sku: !sku,
        }
      });
      return;
    }

    // ── Parse sizes safely ────────────────────────────────
    let sizes: string[] = [];
    try {
      const rawSizes = req.body.sizes;
      if (Array.isArray(rawSizes)) {
        sizes = rawSizes;
      } else if (typeof rawSizes === 'string') {
        // Try JSON first: ["S","M","L"]
        if (rawSizes.startsWith('[')) {
          sizes = JSON.parse(rawSizes);
        } else {
          // Fallback: comma separated "S, M, L"
          sizes = rawSizes.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }
    } catch {
      sizes = [];
    }

    // ── Parse colors safely ───────────────────────────────
    let colors: string[] = [];
    try {
      const rawColors = req.body.colors;
      if (Array.isArray(rawColors)) {
        colors = rawColors;
      } else if (typeof rawColors === 'string') {
        if (rawColors.startsWith('[')) {
          colors = JSON.parse(rawColors);
        } else {
          colors = rawColors.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }
    } catch {
      colors = [];
    }

    // ── Get image URLs uploaded to Cloudinary ─────────────
    const images = req.files
      ? (req.files as Express.Multer.File[]).map((f: any) => f.path)
      : [];

    console.log('Creating product:', { name, category, sizes, colors, images: images.length });

    const product = await productService.createProduct({
      name,
      description,
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : undefined,
      category,
      subcategory: subcategory || undefined,
      sizes,
      colors,
      stock: Number(stock),
      sku,
      images,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/products/:id ─────────────────────────────────
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ message: 'Product updated', product });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/products/:id ──────────────────────────────
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/products/:id/images ─────────────────────────
export const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const images = req.files
      ? (req.files as Express.Multer.File[]).map((f: any) => f.path)
      : [];

    if (images.length === 0) {
      res.status(400).json({ message: 'No images uploaded' });
      return;
    }

    const product = await productService.addProductImages(req.params.id, images);
    res.json({ message: 'Images uploaded', product });
  } catch (err) {
    next(err);
  }
};