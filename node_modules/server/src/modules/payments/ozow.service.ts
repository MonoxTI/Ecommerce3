import axios from 'axios';
import crypto from 'crypto';
import { env } from '../../config/env';
import { Payment } from './payment.model';
import { Order } from '../orders/order.model';

const OZOW_BASE = 'https://api.ozow.com';

// ── Generate Ozow Hash ────────────────────────────────────
// Ozow requires a SHA512 hash of specific fields for security
const generateOzowHash = (fields: Record<string, string>): string => {
  const concatenated = Object.values(fields).join('') + env.OZOW_PRIVATE_KEY;
  return crypto.createHash('sha512').update(concatenated).digest('hex').toLowerCase();
};

// ── Initialize Ozow Payment ───────────────────────────────
export const initializeOzow = async (orderId: string, userId: string) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');
  if (order.userId !== userId) throw new Error('Order not found');
  if (order.status !== 'pending') throw new Error('Order is not awaiting payment');

  const reference = `OZW-${orderId}-${Date.now()}`;
  const amount = Number(order.total).toFixed(2);

  // Create payment record in DB
  await Payment.create({
    orderId,
    userId,
    provider: 'ozow',
    amount: Number(order.total),
    currency: 'ZAR',
    reference,
  });

  // Fields Ozow requires for hash (order matters)
  const hashFields = {
    SiteCode: env.OZOW_SITE_CODE,
    CountryCode: 'ZA',
    CurrencyCode: 'ZAR',
    Amount: amount,
    TransactionReference: reference,
    BankReference: orderId,
    IsTest: env.OZOW_IS_TEST.toString(),
  };

  const hashCheck = generateOzowHash(hashFields);

  // Build the Ozow payment URL directly (Ozow uses redirect-based flow)
  const params = new URLSearchParams({
    ...hashFields,
    HashCheck: hashCheck,
    SuccessUrl: `${env.CLIENT_URL}/orders/${orderId}?payment=success`,
    ErrorUrl: `${env.CLIENT_URL}/orders/${orderId}?payment=error`,
    CancelUrl: `${env.CLIENT_URL}/orders/${orderId}?payment=cancelled`,
    NotifyUrl: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/payments/ozow/webhook`,
    Customer: userId,
    Optional1: orderId,
  });

  const paymentUrl = `https://pay.ozow.com/?${params.toString()}`;

  return { paymentUrl, reference };
};

// ── Verify Ozow Webhook Hash ──────────────────────────────
export const verifyOzowWebhook = (data: Record<string, string>): boolean => {
  const { HashCheck, ...rest } = data;

  // Rebuild hash from received data to verify it's genuinely from Ozow
  const hashFields = {
    SiteCode: rest.SiteCode || '',
    CountryCode: rest.CountryCode || '',
    CurrencyCode: rest.CurrencyCode || '',
    Amount: rest.Amount || '',
    TransactionReference: rest.TransactionReference || '',
    BankReference: rest.BankReference || '',
    Status: rest.Status || '',
    Optional1: rest.Optional1 || '',
    IsTest: rest.IsTest || '',
  };

  const expectedHash = generateOzowHash(hashFields);
  return expectedHash === HashCheck?.toLowerCase();
};

// ── Handle Ozow Webhook ───────────────────────────────────
export const handleOzowEvent = async (data: Record<string, string>) => {
  const { TransactionReference, Status } = data;

  const payment = await Payment.findOne({ where: { reference: TransactionReference } });
  if (!payment) return;

  if (Status === 'Complete') {
    await payment.update({
      status: 'successful',
      providerReference: data.TransactionId,
      metadata: data,
    });

    const order = await Order.findByPk(payment.orderId);
    if (order && order.status === 'pending') {
      await order.update({ status: 'confirmed' });
    }
  } else if (Status === 'Cancelled') {
    await payment.update({ status: 'cancelled' });
  } else if (Status === 'Error') {
    await payment.update({ status: 'failed' });
  }
};