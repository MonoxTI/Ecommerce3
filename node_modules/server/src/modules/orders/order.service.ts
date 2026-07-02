import { sequelize } from '../../config/db';
import { Order, ShippingAddress, OrderStatus } from './order.model';
import { Product } from '../products/product.model';
import { getCart, clearCart } from '../cart/cart.service';

const SHIPPING_FEE = 80; // R80 flat shipping fee — adjust to your currency

// ── Place Order ───────────────────────────────────────────
export const placeOrder = async (
  userId: string,
  shippingAddress: ShippingAddress,
  notes?: string
) => {
  // 1. Get current cart
  const cart = await getCart(userId);
  if (cart.items.length === 0) {
    throw new Error('Your cart is empty');
  }

  // 2. Validate all products still exist and have enough stock
  for (const item of cart.items) {
    const product = await Product.findByPk(item.productId);
    if (!product || !product.isActive) {
      throw new Error(`${item.name} is no longer available`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Only ${product.stock} units of ${item.name} left in stock`);
    }
  }

  const subtotal = cart.total;
  const shippingFee = SHIPPING_FEE;
  const total = subtotal + shippingFee;

  // 3. Use a DB transaction — if anything fails, everything rolls back
  const order = await sequelize.transaction(async (t) => {
    // Create the order record
    const newOrder = await Order.create(
      {
        userId,
        items: cart.items,
        shippingAddress,
        subtotal,
        shippingFee,
        total,
        notes,
        status: 'pending',
      },
      { transaction: t }
    );

    // Reduce stock for each product atomically
    for (const item of cart.items) {
      await Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.productId },
        transaction: t,
      });
    }

    return newOrder;
  });

  // 4. Clear the cart after successful order
  await clearCart(userId);

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

  // Non-admin users can only view their own orders
  if (!isAdmin && order.userId !== userId) {
    throw new Error('Order not found');
  }

  return order;
};

// ── Cancel Order ──────────────────────────────────────────
export const cancelOrder = async (
  id: string,
  userId: string,
  cancelReason: string
) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');
  if (order.userId !== userId) throw new Error('Order not found');

  // Can only cancel if not yet shipped
  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    throw new Error(`Cannot cancel an order that is already ${order.status}`);
  }

  // Restore stock in a transaction
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

  return Order.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });
};

// ── Admin: Update Order Status ────────────────────────────
export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  trackingNumber?: string
) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error('Order not found');

  if (order.status === 'cancelled') {
    throw new Error('Cannot update a cancelled order');
  }

  await order.update({
    status,
    ...(trackingNumber && { trackingNumber }),
  });

  return order;
};