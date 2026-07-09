import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { sanitizeInput, preventInjection } from './middleware/sanitize';
import { apiLimiter, authLimiter, paymentLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';
import cartRoutes from './modules/cart/cart.routes';
import orderRoutes from './modules/orders/order.routes';
import paymentRoutes from './modules/payments/payment.routes';
import userRoutes from './modules/users/user.routes';
import trackingRoutes from './modules/tracking/tracking.routes';

const app = express();

// ── Security Headers ──────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'res.cloudinary.com'],
      connectSrc: ["'self'", 'api.paystack.co', 'pay.ozow.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ── CORS ──────────────────────────────────────────────────
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // reject bodies larger than 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── HTTP Parameter Pollution Prevention ───────────────────
app.use(hpp());

// ── Logging ───────────────────────────────────────────────
if (env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Input Sanitization (applies to all routes) ────────────
app.use(sanitizeInput);
app.use(preventInjection);

// ── Global Rate Limit ─────────────────────────────────────
app.use('/api', apiLimiter);

// ── Routes with specific limiters ────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentLimiter, paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tracking', trackingRoutes);

// ── Health Check ──────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error Handler (must be last) ──────────────────────────
app.use(errorHandler);

export default app;