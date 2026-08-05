import { Category } from './category.model';

// ── Generate slug from name ───────────────────────────────
const toSlug = (name: string) =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// ── Get all active categories ─────────────────────────────
export const getAllCategories = async (includeInactive = false) => {
  return Category.findAll({
    where: includeInactive ? {} : { isActive: true },
    order: [['sortOrder', 'ASC'], ['name', 'ASC']],
  });
};

// ── Get single category by slug ───────────────────────────
export const getCategoryBySlug = async (slug: string) => {
  const cat = await Category.findOne({ where: { slug, isActive: true } });
  if (!cat) throw new Error('Category not found');
  return cat;
};

// ── Create category ───────────────────────────────────────
export const createCategory = async (data: {
  name: string;
  description?: string;
  image?: string;
  sortOrder?: number;
}) => {
  const slug = toSlug(data.name);
  const existing = await Category.findOne({ where: { slug } });
  if (existing) throw new Error(`Category "${data.name}" already exists`);

  return Category.create({
    name: data.name,
    slug,
    description: data.description,
    image: data.image,
    sortOrder: data.sortOrder ?? 0,
  });
};

// ── Update category ───────────────────────────────────────
export const updateCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    sortOrder?: number;
  }
) => {
  const cat = await Category.findByPk(id);
  if (!cat) throw new Error('Category not found');

  // If name changed, regenerate slug
  const updates: any = { ...data };
  if (data.name && data.name !== cat.name) {
    const newSlug = toSlug(data.name);
    const existing = await Category.findOne({ where: { slug: newSlug } });
    if (existing && existing.id !== id) {
      throw new Error(`Category "${data.name}" already exists`);
    }
    updates.slug = newSlug;
  }

  await cat.update(updates);
  return cat;
};

// ── Delete category ───────────────────────────────────────
export const deleteCategory = async (id: string) => {
  const cat = await Category.findByPk(id);
  if (!cat) throw new Error('Category not found');
  await cat.destroy();
  return { message: 'Category deleted' };
};