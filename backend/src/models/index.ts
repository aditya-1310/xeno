import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'xeno_crm',
  username: process.env.DB_USER || 'xeno_user',
  password: process.env.DB_PASSWORD || 'xeno_pass',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Import models
import Customer from './Customer';
import Order from './Order';
import Segment from './Segment';
import Campaign from './Campaign';

// Export models
export {
  Customer,
  Order,
  Segment,
  Campaign,
}; 