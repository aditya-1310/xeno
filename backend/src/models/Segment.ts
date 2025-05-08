import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import Customer from './Customer';

export interface SegmentAttributes {
  id: string;
  name: string;
  description: string;
  rules: any; // JSON field for storing rule conditions
  customerCount: number;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Segment extends Model<SegmentAttributes> implements SegmentAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public rules!: any;
  public customerCount!: number;
  public createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Segment.init(
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
      allowNull: true,
    },
    rules: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    customerCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'segments',
    timestamps: true,
  }
);

// Define many-to-many relationship with customers
Segment.belongsToMany(Customer, {
  through: 'segment_customers',
  foreignKey: 'segmentId',
  otherKey: 'customerId',
});

Customer.belongsToMany(Segment, {
  through: 'segment_customers',
  foreignKey: 'customerId',
  otherKey: 'segmentId',
});

export default Segment; 