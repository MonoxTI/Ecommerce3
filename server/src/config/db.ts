import { Sequelize } from 'sequelize';
import { env } from './env';

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined — check your .env file');
}

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  logging: env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ PostgreSQL connected');
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
};