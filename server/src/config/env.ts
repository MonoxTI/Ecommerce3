import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET!,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,

  // Paystack
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY!,
  PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY!,

  // Ozow
  OZOW_SITE_CODE: process.env.OZOW_SITE_CODE!,
  OZOW_API_KEY: process.env.OZOW_API_KEY!,
  OZOW_PRIVATE_KEY: process.env.OZOW_PRIVATE_KEY!,
  OZOW_IS_TEST: process.env.OZOW_IS_TEST === 'true',
};