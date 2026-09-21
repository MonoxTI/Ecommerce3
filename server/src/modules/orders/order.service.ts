import { sequelize } from '../../config/db';
import { Order, ShippingAddress, OrderStatus } from './order.model';
import { Product } from '../products/product.model';
import { getCart, clearCart } from '../cart/cart.service';
import { initOrderTracking } from '../tracking/tracking.service';

const SHIPPING_FEE = 80;

// ── Place Order ───────────────────────────────────────────
export const placeOrder = async (
  userId: string,
  shippingAddress: ShippingAddress,
  notes?: string,
  paymentMethod?: string
) => {
  const cart = await getCart(userId);
  if (cart.items.length === 0) throw new Error('Your cart is empty');

  for (const item of cart.items) {
    const product = await Product.findByPk(item.productId);
    if (!product || !product.isActive)
      throw new Error(`${item.name} is no longer available`);
    if (product.stock < item.quantity)
      throw new Error(`Only ${product.stock} units of ${item.name} left in stock`);
  }

  const subtotal = cart.total;
  const shippingFee = Number(subtotal) >= 800 ? 0 : SHIPPING_FEE;
  const total = Number(subtotal) + shippingFee;

  const order = await sequelize.transaction(async (t) => {
    const newOrder = await Order.create(
      {
        userId,
        items: cart.items,
        shippingAddress,
        subtotal,
        shippingFee,
        total,
        notes,
        paymentMethod: paymentMethod || 'manual',
        status: 'pending',
      },
      { transaction: t }
    );

    for (const item of cart.items) {
      await Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.productId },
        transaction: t,
      });
    }

    return newOrder;
  });

  await clearCart(userId);
  await initOrderTracking(order.id);

  return order;
};

// ── Get User Orders ───────────────────────────────────────
export const getUserOrders = async (userId: string) => {
  return Order.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
};

// ── Get Single Order ──────────────────────────────────────
export const getOrderById = async (id: string, userId: string, isAdmin = false) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');
  if (!isAdmin && order.userId !== userId) throw new Error('Order not found');
  return order;
};

// ── Cancel Order ──────────────────────────────────────────
export const cancelOrder = async (id: string, userId: string, cancelReason: string) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');
  if (order.userId !== userId) throw new Error('Order not found');
  if (['shipped', 'delivered', 'cancelled'].includes(order.status))
    throw new Error(`Cannot cancel an order that is already ${order.status}`);

  await sequelize.transaction(async (t) => {
    await order.update({ status: 'cancelled', cancelReason }, { transaction: t });
    for (const item of order.items) {
      await Product.increment('stock', {
        by: item.quantity,
        where: { id: item.productId },
        transaction: t,
      });
    }
  });

  return order;
};

// ── Admin: Get All Orders ─────────────────────────────────
export const getAllOrders = async (status?: OrderStatus) => {
  const where: any = {};
  if (status) where.status = status;
  return Order.findAll({ where, order: [['createdAt', 'DESC']] });
};

// ── Admin: Update Order Status ────────────────────────────
export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  trackingNumber?: string
) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');
  if (order.status === 'cancelled') throw new Error('Cannot update a cancelled order');
  await order.update({ status, ...(trackingNumber && { trackingNumber }) });
  return order;
};