import redis from '../../config/redis';
import { Product } from '../products/product.model';

// Each user's cart is stored as a Redis hash
// Key pattern: cart:{userId}
// Field: productId:size:color
// Value: JSON string of cart item

interface AddToCartInput {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  subtotal: number;
}

const CART_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds
const cartKey = (userId: string) => `cart:${userId}`;
const itemKey = (productId: string, size: string, color: string) =>
  `${productId}:${size}:${color}`;

// ── Get Cart ──────────────────────────────────────────────
export const getCart = async (userId: string) => {
  const key = cartKey(userId);
  const raw = await redis.hgetall(key);

  if (!raw || Object.keys(raw).length === 0) {
    return { items: [], total: 0, itemCount: 0 };
  }

  const items: CartItem[] = Object.values(raw).map((v) => JSON.parse(v));

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    total: Number(total.toFixed(2)),
    itemCount,
  };
};

// ── Add Item to Cart ──────────────────────────────────────
export const addToCart = async (userId: string, input: AddToCartInput) => {
  const { productId, size, color, quantity } = input;

  // Validate product exists and has stock
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');
  if (!product.isActive) throw new Error('Product is no longer available');
  if (product.stock < quantity) {
    throw new Error(`Only ${product.stock} items left in stock`);
  }
  if (!product.sizes.includes(size)) {
    throw new Error(`Size ${size} is not available for this product`);
  }
  if (!product.colors.includes(color)) {
    throw new Error(`Color ${color} is not available for this product`);
  }

  const key = cartKey(userId);
  const field = itemKey(productId, size, color);

  // Check if item already exists in cart — if so, increase quantity
  const existing = await redis.hget(key, field);
  let newQuantity = quantity;

  if (existing) {
    const existingItem: CartItem = JSON.parse(existing);
    newQuantity = existingItem.quantity + quantity;

    if (product.stock < newQuantity) {
      throw new Error(`Only ${product.stock} items available`);
    }
  }

  const cartItem: CartItem = {
    productId,
    name: product.name,
    price: Number(product.price),
    image: product.images[0] || '',
    size,
    color,
    quantity: newQuantity,
    subtotal: Number((Number(product.price) * newQuantity).toFixed(2)),
  };

  // Save to Redis hash and reset expiry
  await redis.hset(key, field, JSON.stringify(cartItem));
  await redis.expire(key, CART_EXPIRY);

  return getCart(userId);
};

// ── Update Item Quantity ───────────────────────────────────
export const updateCartItem = async (
  userId: string,
  productId: string,
  size: string,
  color: string,
  quantity: number
) => {
  const key = cartKey(userId);
  const field = itemKey(productId, size, color);

  const existing = await redis.hget(key, field);
  if (!existing) throw new Error('Item not found in cart');

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    await redis.hdel(key, field);
    return getCart(userId);
  }

  // Validate stock
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < quantity) {
    throw new Error(`Only ${product.stock} items left in stock`);
  }

  const existingItem: CartItem = JSON.parse(existing);
  const updatedItem: CartItem = {
    ...existingItem,
    quantity,
    subtotal: Number((existingItem.price * quantity).toFixed(2)),
  };

  await redis.hset(key, field, JSON.stringify(updatedItem));
  await redis.expire(key, CART_EXPIRY);

  return getCart(userId);
};

// ── Remove Single Item ────────────────────────────────────
export const removeFromCart = async (
  userId: string,
  productId: string,
  size: string,
  color: string
) => {
  const key = cartKey(userId);
  const field = itemKey(productId, size, color);

  const existing = await redis.hget(key, field);
  if (!existing) throw new Error('Item not found in cart');

  await redis.hdel(key, field);
  return getCart(userId);
};

// ── Clear Entire Cart ─────────────────────────────────────
export const clearCart = async (userId: string) => {
  await redis.del(cartKey(userId));
  return { items: [], total: 0, itemCount: 0 };
};