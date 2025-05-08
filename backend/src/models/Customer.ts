import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

export interface CustomerAttributes {
  id: string;
  email: string;
  name: string;
  lastActive: Date;
  totalSpent: number;
  visitCount: number;
  orderCount: number;
  daysSinceLastOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Customer extends Model<CustomerAttributes> implements CustomerAttributes {
  public id!: string;
  public email!: string;
  public name!: string;
  public lastActive!: Date;
  public totalSpent!: number;
  public visitCount!: number;
  public orderCount!: number;
  public daysSinceLastOrder!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    totalSpent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    visitCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    orderCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    daysSinceLastOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
  }
);

export default Customer; 