import { Request, Response, NextFunction } from 'express';
import * as cartService from './cart.service';

// ── GET /api/cart ─────────────────────────────────────────
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart(req.userId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// ── POST /api/cart ────────────────────────────────────────
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, size, color, quantity } = req.body;

    if (!productId || !size || !color || !quantity) {
      res.status(400).json({ message: 'productId, size, color and quantity are required' });
      return;
    }
    if (quantity < 1) {
      res.status(400).json({ message: 'Quantity must be at least 1' });
      return;
    }

    const cart = await cartService.addToCart(req.userId, {
      productId,
      size,
      color,
      quantity: Number(quantity),
    });

    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/cart/item ────────────────────────────────────
export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, size, color, quantity } = req.body;

    if (!productId || !size || !color || quantity === undefined) {
      res.status(400).json({ message: 'productId, size, color and quantity are required' });
      return;
    }

    const cart = await cartService.updateCartItem(
      req.userId,
      productId,
      size,
      color,
      Number(quantity)
    );

    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/cart/item ─────────────────────────────────
export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, size, color } = req.body;

    if (!productId || !size || !color) {
      res.status(400).json({ message: 'productId, size and color are required' });
      return;
    }

    const cart = await cartService.removeFromCart(req.userId, productId, size, color);
    res.json({ message: 'Item removed from cart', cart });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/cart ──────────────────────────────────────
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.clearCart(req.userId);
    res.json({ message: 'Cart cleared', cart });
  } catch (err) {
    next(err);
  }
};