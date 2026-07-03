import { Request, Response, NextFunction } from 'express';
import * as paystackService from './paystack.service';
import * as ozowService from './ozow.service';
import { Payment } from './payment.model';

export const initializePaystack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    if (!orderId) { res.status(400).json({ message: 'orderId is required' }); return; }
    const result = await paystackService.initializePaystack(orderId, req.userId);
    res.json({ message: 'Payment initialized', provider: 'paystack', ...result });
  } catch (err) { next(err); }
};

export const paystackWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const rawBody = JSON.stringify(req.body);
    if (!paystackService.verifyPaystackWebhook(signature, rawBody)) {
      res.status(401).json({ message: 'Invalid webhook signature' }); return;
    }
    res.status(200).json({ received: true });
    await paystackService.handlePaystackEvent(req.body);
  } catch (err) { next(err); }
};

export const verifyPaystack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await paystackService.verifyPaystackPayment(req.params.reference);
    res.json(data);
  } catch (err) { next(err); }
};

export const initializeOzow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    if (!orderId) { res.status(400).json({ message: 'orderId is required' }); return; }
    const result = await ozowService.initializeOzow(orderId, req.userId);
    res.json({ message: 'Payment initialized', provider: 'ozow', ...result });
  } catch (err) { next(err); }
};

export const ozowWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body as Record<string, string>;
    if (!ozowService.verifyOzowWebhook(data)) {
      res.status(401).json({ message: 'Invalid webhook signature' }); return;
    }
    res.status(200).json({ received: true });
    await ozowService.handleOzowEvent(data);
  } catch (err) { next(err); }
};

export const getOrderPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await Payment.findAll({
      where: { orderId: req.params.orderId, userId: req.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(payments);
  } catch (err) { next(err); }
};