import { Op } from 'sequelize';
import { Product } from './product.model';

interface ProductInput {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  images?: string[];
}

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ── Get All Products (with filters & pagination) ──────────
export const getAllProducts = async (filters: ProductFilters) => {
  const {
    category,
    minPrice,
    maxPrice,
    size,
    color,
    search,
    page = 1,
    limit = 12,
  } = filters;

  const where: any = { isActive: true };

  if (category) where.category = category;
  if (search) where.name = { [Op.iLike]: `%${search}%` }; // case-insensitive search
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }
  if (size) where.sizes = { [Op.contains]: [size] };
  if (color) where.colors = { [Op.contains]: [color] };

  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    products: rows,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
    hasMore: offset + rows.length < count,
  };
};

// ── Get Single Product ────────────────────────────────────
export const getProductById = async (id: string) => {
  const product = await Product.findOne({
    where: { id, isActive: true },
  });
  if (!product) throw new Error('Product not found');
  return product;
};

// ── Get Products by Category ──────────────────────────────
export const getProductsByCategory = async (category: string) => {
  return Product.findAll({
    where: { category, isActive: true },
    order: [['createdAt', 'DESC']],
  });
};

// ── Create Product ────────────────────────────────────────
export const createProduct = async (data: ProductInput) => {
  // Check SKU is unique
  const existing = await Product.findOne({ where: { sku: data.sku } });
  if (existing) throw new Error('SKU already exists');

  return Product.create(data);
};

// ── Update Product ────────────────────────────────────────
export const updateProduct = async (id: string, data: Partial<ProductInput>) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  await product.update(data);
  return product;
};

// ── Delete Product (soft delete) ──────────────────────────
export const deleteProduct = async (id: string) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  await product.update({ isActive: false }); // soft delete — keeps DB record
  return { message: 'Product deleted successfully' };
};

// ── Add Images to Product ─────────────────────────────────
export const addProductImages = async (id: string, imageUrls: string[]) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error('Product not found');

  const updatedImages = [...product.images, ...imageUrls];
  await product.update({ images: updatedImages });
  return product;
};