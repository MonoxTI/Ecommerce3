import { Request, Response, NextFunction } from 'express';
import * as trackingService from './tracking.service';
import { TrackingEventType } from './tracking.model';

const VALID_EVENTS: TrackingEventType[] = [
  'order_placed', 'payment_confirmed', 'processing',
  'packed', 'dispatched', 'out_for_delivery',
  'delivered', 'delivery_failed', 'returned',
];

// ── GET /api/tracking/:orderId ────────────────────────────
export const getTracking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.userRole === 'admin';
    const data = await trackingService.getTrackingHistory(
      req.params.orderId,
      req.userId,
      isAdmin
    );
    res.json(data);
  } catch (err) { next(err); }
};

// ── POST /api/tracking/:orderId (admin) ───────────────────
export const addEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { event, description, location } = req.body;

    if (!event || !description) {
      res.status(400).json({ message: 'event and description are required' });
      return;
    }
    if (!VALID_EVENTS.includes(event)) {
      res.status(400).json({ message: `event must be one of: ${VALID_EVENTS.join(', ')}` });
      return;
    }

    const trackingEvent = await trackingService.addTrackingEvent(
      req.params.orderId,
      event,
      description,
      location
    );

    res.status(201).json({ message: 'Tracking event added', trackingEvent });
  } catch (err) { next(err); }
};