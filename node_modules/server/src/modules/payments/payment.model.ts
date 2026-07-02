import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

export type PaymentProvider = 'paystack' | 'ozow';
export type PaymentStatus = 'pending' | 'successful' | 'failed' | 'cancelled';

interface PaymentAttributes {
  id: string;
  orderId: string;
  userId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  reference: string;       // your unique reference sent to provider
  providerReference?: string; // reference returned by provider
  metadata?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes
  extends Optional<PaymentAttributes, 'id' | 'status' | 'providerReference' | 'metadata'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> {
  declare id: string;
  declare orderId: string;
  declare userId: string;
  declare provider: PaymentProvider;
  declare status: PaymentStatus;
  declare amount: number;
  declare currency: string;
  declare reference: string;
  declare providerReference: string;
  declare metadata: object;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    provider: {
      type: DataTypes.ENUM('paystack', 'ozow'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'successful', 'failed', 'cancelled'),
      defaultValue: 'pending',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'ZAR',
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    providerReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
  }
);