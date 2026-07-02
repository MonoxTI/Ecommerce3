import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  sku: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'comparePrice' | 'subcategory' | 'isActive'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description: string;
  declare price: number;
  declare comparePrice: number;
  declare category: string;
  declare subcategory: string;
  declare sizes: string[];
  declare colors: string[];
  declare images: string[];
  declare stock: number;
  declare sku: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    comparePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sizes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    colors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
  }
);