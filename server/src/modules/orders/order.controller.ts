import { Request, Response, NextFunction } from 'express';
import * as orderService from './order.service';
import { OrderStatus } from './order.model';

// ── POST /api/orders ──────────────────────────────────────
export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shippingAddress, notes } = req.body;

    if (!shippingAddress) {
      res.status(400).json({ message: 'Shipping address is required' });
      return;
    }

    const { fullName, phone, street, city, province, postalCode, country } = shippingAddress;
    if (!fullName || !phone || !street || !city || !province || !postalCode || !country) {
      res.status(400).json({ message: 'All shipping address fields are required' });
      return;
    }

    const order = await orderService.placeOrder(req.userId, shippingAddress, notes);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders ───────────────────────────────────────
export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getUserOrders(req.userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders/:id ───────────────────────────────────
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.userRole === 'admin';
    const order = await orderService.getOrderById(req.params.id, req.userId, isAdmin);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/orders/:id/cancel ────────────────────────────
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cancelReason } = req.body;

    if (!cancelReason) {
      res.status(400).json({ message: 'Please provide a reason for cancellation' });
      return;
    }

    const order = await orderService.cancelOrder(req.params.id, req.userId, cancelReason);
    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/orders/admin/all ─────────────────────────────
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const orders = await orderService.getAllOrders(status as OrderStatus);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/orders/admin/:id ─────────────────────────────
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, trackingNumber } = req.body;

    const validStatuses: OrderStatus[] = [
      'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled',
    ];

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const order = await orderService.updateOrderStatus(req.params.id, status, trackingNumber);
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    next(err);
  }
};