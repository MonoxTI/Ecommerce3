import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { sanitizeInput, preventInjection } from './middleware/sanitize';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';
import cartRoutes from './modules/cart/cart.routes';
import orderRoutes from './modules/orders/order.routes';
import userRoutes from './modules/users/user.routes';
import trackingRoutes from './modules/tracking/tracking.routes';
import categoryRoutes from './modules/categories/category.routes';

const app = express();

// ── Security Headers ──────────────────────────────────────

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// ── Private Network Access ────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});

// ── CORS ──────────────────────────────────────────────────

app.use(cors({
  origin: [
    'https://ecommerce3-client.vercel.app',
    'http://localhost:5173',
    'http://localhost:5002',
    'https://ecommerce3.itumonokoane84.workers.dev',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight requests explicitly
app.options('*', cors());

// ── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // reject bodies larger than 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(hpp());

if (env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(sanitizeInput);
app.use(preventInjection);
app.use('/api', apiLimiter);

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/categories', categoryRoutes);
// ❌ Payment routes removed

app.get('/health', (_, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.use(errorHandler);

export default app;
