import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../config/redis';

// ── General API limiter ───────────────────────────────────
// Applies to all routes — prevents API abuse
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per 15 min per IP
  message: { message: 'Too many requests, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args as [string, ...string[]]),
  }),
});

// ── Auth limiter ──────────────────────────────────────────
// Stricter — prevents brute force login attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // only 10 login attempts per 15 min
  message: { message: 'Too many login attempts, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args as [string, ...string[]]),
  }),
});

// ── Payment limiter ───────────────────────────────────────
// Prevents payment endpoint abuse
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,                   // 20 payment attempts per hour
  message: { message: 'Too many payment attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args as [string, ...string[]]),
  }),
});