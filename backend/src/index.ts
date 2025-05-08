import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';
import customerRoutes from './routes/customers';
import orderRoutes from './routes/orders';
import segmentRoutes from './routes/segments';
import campaignRoutes from './routes/campaigns';
import authRoutes from './routes/auth';
import { setupRabbitMQ } from './services/rabbitmq';
import { setupRedis } from './services/redis';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize services and start server
async function startServer() {
  try {
    // Initialize database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Initialize RabbitMQ
    await setupRabbitMQ();
    console.log('RabbitMQ connection established successfully.');

    // Initialize Redis
    await setupRedis();
    console.log('Redis connection established successfully.');

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 