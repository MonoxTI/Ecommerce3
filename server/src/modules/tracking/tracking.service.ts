import { TrackingEvent, TrackingEventType } from './tracking.model';
import { Order } from '../orders/order.model';

// ── Get all tracking events for an order ─────────────────
export const getTrackingHistory = async (orderId: string, userId: string, isAdmin = false) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');
  if (!isAdmin && order.userId !== userId) throw new Error('Order not found');

  const events = await TrackingEvent.findAll({
    where: { orderId },
    order: [['createdAt', 'DESC']],
  });

  return {
    orderId,
    orderStatus: order.status,
    trackingNumber: order.trackingNumber,
    events,
  };
};

// ── Add a tracking event (admin) ──────────────────────────
export const addTrackingEvent = async (
  orderId: string,
  event: TrackingEventType,
  description: string,
  location?: string
) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');

  const trackingEvent = await TrackingEvent.create({
    orderId,
    event,
    description,
    location,
  });

  // Sync order status with tracking event
  const statusMap: Partial<Record<TrackingEventType, string>> = {
    order_placed: 'pending',
    payment_confirmed: 'confirmed',
    processing: 'processing',
    packed: 'processing',
    dispatched: 'shipped',
    out_for_delivery: 'shipped',
    delivered: 'delivered',
    returned: 'cancelled',
  };

  const newStatus = statusMap[event];
  if (newStatus && order.status !== newStatus) {
    await order.update({ status: newStatus });
  }

  return trackingEvent;
};

// ── Get latest event for an order ────────────────────────
export const getLatestEvent = async (orderId: string) => {
  return TrackingEvent.findOne({
    where: { orderId },
    order: [['createdAt', 'DESC']],
  });
};

// ── Auto-create initial tracking event when order placed ──
export const initOrderTracking = async (orderId: string) => {
  return TrackingEvent.create({
    orderId,
    event: 'order_placed',
    description: 'Your order has been received and is awaiting payment confirmation.',
    location: 'KIR Warehouse',
  });
};