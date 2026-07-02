import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

// ── Order Item (stored as JSON inside Order) ──────────────
export interface OrderItemData {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  subtotal: number;
}

// ── Shipping Address ──────────────────────────────────────
export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

// ── Order Status Flow ─────────────────────────────────────
export type OrderStatus =
  | 'pending'       // just placed, awaiting payment
  | 'confirmed'     // payment received
  | 'processing'    // being packed
  | 'shipped'       // on the way
  | 'delivered'     // received by customer
  | 'cancelled';    // cancelled

interface OrderAttributes {
  id: string;
  userId: string;
  items: OrderItemData[];
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  total: number;
  trackingNumber?: string;
  notes?: string;
  cancelReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes
  extends Optional
    OrderAttributes,
    'id' | 'status' | 'trackingNumber' | 'notes' | 'cancelReason'
  > {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  declare id: string;
  declare userId: string;
  declare items: OrderItemData[];
  declare shippingAddress: ShippingAddress;
  declare status: OrderStatus;
  declare subtotal: number;
  declare shippingFee: number;
  declare total: number;
  declare trackingNumber: string;
  declare notes: string;
  declare cancelReason: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    items: {
      type: DataTypes.JSONB, // stores array of OrderItemData
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      ),
      defaultValue: 'pending',
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancelReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
  }
);