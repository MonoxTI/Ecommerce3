import axios from 'axios';
import crypto from 'crypto';
import { env } from '../../config/env';
import { Payment } from './payment.model';
import { Order } from '../orders/order.model';
import { User } from '../auth/auth.model';

const PAYSTACK_BASE = 'https://api.paystack.co';

const paystackAPI = axios.create({
  baseURL: PAYSTACK_BASE,
  headers: {
    Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// ── Initialize Paystack Payment ───────────────────────────
export const initializePaystack = async (orderId: string, userId: string) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');
  if (order.userId !== userId) throw new Error('Order not found');
  if (order.status !== 'pending') throw new Error('Order is not awaiting payment');

  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  // Generate unique reference
  const reference = `PAY-${orderId}-${Date.now()}`;

  // Create payment record in DB
  await Payment.create({
    orderId,
    userId,
    provider: 'paystack',
    amount: Number(order.total),
    currency: 'ZAR',
    reference,
  });

  // Call Paystack API — amount must be in kobo (cents) so multiply by 100
  const response = await paystackAPI.post('/transaction/initialize', {
    email: user.email,
    amount: Math.round(Number(order.total) * 100),
    currency: 'ZAR',
    reference,
    callback_url: `${env.CLIENT_URL}/orders/${orderId}?payment=success`,
    metadata: {
      orderId,
      userId,
      custom_fields: [
        { display_name: 'Order ID', variable_name: 'order_id', value: orderId },
      ],
    },
  });

  return {
    authorizationUrl: response.data.data.authorization_url,
    reference,
    accessCode: response.data.data.access_code,
  };
};

// ── Verify Paystack Webhook ───────────────────────────────
export const verifyPaystackWebhook = (signature: string, body: string): boolean => {
  const hash = crypto
    .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');
  return hash === signature;
};

// ── Handle Paystack Webhook Event ────────────────────────
export const handlePaystackEvent = async (event: any) => {
  if (event.event !== 'charge.success') return;

  const { reference, status } = event.data;

  const payment = await Payment.findOne({ where: { reference } });
  if (!payment) return;

  if (status === 'success') {
    // Update payment record
    await payment.update({
      status: 'successful',
      providerReference: event.data.id?.toString(),
      metadata: event.data,
    });

    // Confirm the order
    const order = await Order.findByPk(payment.orderId);
    if (order && order.status === 'pending') {
      await order.update({ status: 'confirmed' });
    }
  } else {
    await payment.update({ status: 'failed' });
  }
};

// ── Verify Payment by Reference (for frontend polling) ────
export const verifyPaystackPayment = async (reference: string) => {
  const response = await paystackAPI.get(`/transaction/verify/${reference}`);
  return response.data.data;
};