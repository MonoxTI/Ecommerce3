import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

interface CategoryAttributes {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type CategoryCreationAttributes = Optional
  CategoryAttributes,
  'id' | 'image' | 'description' | 'isActive' | 'sortOrder'
>;

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare image: string;
  declare description: string;
  declare isActive: boolean;
  declare sortOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Category.init(
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // URL-safe version: "T-Shirts" → "t-shirts"
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // Cloudinary URL
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
  }
);