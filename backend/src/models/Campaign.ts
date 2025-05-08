import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import Segment from './Segment';

export interface CampaignAttributes {
  id: string;
  name: string;
  description: string;
  segmentId: string;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  message: string;
  stats: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Campaign extends Model<CampaignAttributes> implements CampaignAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public segmentId!: string;
  public status!: 'draft' | 'sending' | 'completed' | 'failed';
  public message!: string;
  public stats!: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
  public createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Campaign.init(
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
    segmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Segment,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('draft', 'sending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'draft',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stats: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0,
      },
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'campaigns',
    timestamps: true,
  }
);

// Define associations
Campaign.belongsTo(Segment, { foreignKey: 'segmentId' });
Segment.hasMany(Campaign, { foreignKey: 'segmentId' });

export default Campaign; 