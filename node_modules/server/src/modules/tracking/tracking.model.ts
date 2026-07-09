import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

export type TrackingEventType =
  | 'order_placed'
  | 'payment_confirmed'
  | 'processing'
  | 'packed'
  | 'dispatched'
  | 'out_for_delivery'
  | 'delivered'
  | 'delivery_failed'
  | 'returned';

interface TrackingAttributes {
  id: string;
  orderId: string;
  event: TrackingEventType;
  description: string;
  location?: string;
  createdAt?: Date;
}

type TrackingCreationAttributes = Optional<TrackingAttributes, 'id' | 'location'>;

export class TrackingEvent extends Model<TrackingAttributes, TrackingCreationAttributes> {
  declare id: string;
  declare orderId: string;
  declare event: TrackingEventType;
  declare description: string;
  declare location: string;
  declare readonly createdAt: Date;
}

TrackingEvent.init(
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
    event: {
      type: DataTypes.ENUM(
        'order_placed', 'payment_confirmed', 'processing',
        'packed', 'dispatched', 'out_for_delivery',
        'delivered', 'delivery_failed', 'returned'
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tracking_events',
    timestamps: true,
    updatedAt: false,
  }
);