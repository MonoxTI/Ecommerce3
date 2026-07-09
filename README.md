# KIR — E-Commerce Platform

Street & Raw fashion e-commerce platform built with React, Node.js, PostgreSQL and Redis.

---

## Tech Stack

### Backend
- **Runtime:** Node.js 22 + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL 16 (via Sequelize ORM)
- **Cache / Cart:** Redis 7 (via ioredis)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Payments:** Paystack + Ozow
- **Images:** Cloudinary
- **Security:** Helmet, express-rate-limit, HPP, express-validator

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4
- **State:** Zustand (client) + React Query (server)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod

---

## Getting Started

### Prerequisites
- Node.js 22+
- Docker Desktop
- Cloudinary account (free)
- Paystack account (free test mode)
- Ozow account (test mode)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd ecommerce-app

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Environment variables

Create `.env` in the project root:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxx

# Ozow
OZOW_SITE_CODE=your-site-code
OZOW_API_KEY=your-api-key
OZOW_PRIVATE_KEY=your-private-key
OZOW_IS_TEST=true

# Server URL (for webhooks)
SERVER_URL=http://localhost:5000
```

### 3. Start databases

```bash
# From project root
docker-compose up -d
```

### 4. Run the development servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Login, get JWT |
| GET | /api/auth/me | ✅ | Get current user |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | — | List products (filters: category, size, color, minPrice, maxPrice, search, page, limit) |
| GET | /api/products/:id | — | Single product |
| GET | /api/products/category/:category | — | By category |
| POST | /api/products | Admin | Create product (multipart/form-data) |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Soft delete product |
| POST | /api/products/:id/images | Admin | Add images |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/cart | ✅ | Get cart |
| POST | /api/cart | ✅ | Add item |
| PUT | /api/cart/item | ✅ | Update quantity |
| DELETE | /api/cart/item | ✅ | Remove item |
| DELETE | /api/cart | ✅ | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/orders | ✅ | Place order |
| GET | /api/orders | ✅ | My orders |
| GET | /api/orders/:id | ✅ | Single order |
| PUT | /api/orders/:id/cancel | ✅ | Cancel order |
| GET | /api/orders/admin/all | Admin | All orders |
| PUT | /api/orders/admin/:id | Admin | Update status |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/payments/paystack/initialize | ✅ | Start Paystack payment |
| POST | /api/payments/paystack/webhook | — | Paystack webhook |
| GET | /api/payments/paystack/verify/:ref | ✅ | Verify payment |
| POST | /api/payments/ozow/initialize | ✅ | Start Ozow payment |
| POST | /api/payments/ozow/webhook | — | Ozow webhook |
| GET | /api/payments/order/:orderId | ✅ | Order payments |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | /api/users/profile | ✅ | Update own profile |
| GET | /api/users | Admin | All users |
| GET | /api/users/stats | Admin | User statistics |
| GET | /api/users/:id | Admin | User + order history |
| PUT | /api/users/:id/role | Admin | Change user role |
| DELETE | /api/users/:id | Admin | Delete user |

### Tracking
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/tracking/:orderId | ✅ | Get tracking history |
| POST | /api/tracking/:orderId | Admin | Add tracking event |

---

## Security

| Layer | Implementation |
|-------|---------------|
| Auth | JWT tokens, 7-day expiry |
| Passwords | bcrypt, 12 salt rounds |
| Rate Limiting | 100 req/15min (API), 10 req/15min (auth), 20 req/hr (payments) |
| Headers | Helmet.js (15 security headers) |
| CORS | Locked to CLIENT_URL only |
| Input | Validation + sanitization on all routes |
| Payments | Card details never touch our server |
| SQL | Parameterized queries via Sequelize |
| XSS | Script tag stripping on all inputs |

---

## Admin Access

To make a user admin, run:

```bash
docker exec -it ecommerce_db psql -U postgres -d ecommerce \
  -c "UPDATE users SET role='admin' WHERE email='your@email.com';"
```

Then log in again to get a fresh token with admin role.

---

## Deployment

### Recommended Stack
- **Backend:** Railway or Render (auto HTTPS, env vars)
- **Frontend:** Vercel or Netlify
- **Database:** Railway PostgreSQL or Supabase
- **Redis:** Railway Redis or Upstash
- **Images:** Cloudinary (already configured)

### Pre-deployment checklist
- [ ] Change JWT_SECRET to a long random string
- [ ] Set NODE_ENV=production
- [ ] Update CLIENT_URL to your frontend domain
- [ ] Update SERVER_URL to your backend domain
- [ ] Switch Paystack/Ozow to live keys
- [ ] Set OZOW_IS_TEST=false
- [ ] Enable HTTPS (automatic on Railway/Render)

---

## License

MIT — built for KIR fashion platform.

