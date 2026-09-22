import { DataTypes, Model } from 'sequelize';
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

type CategoryCreationAttributes = {
  name: string;
  slug: string;
  image?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
};

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
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
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