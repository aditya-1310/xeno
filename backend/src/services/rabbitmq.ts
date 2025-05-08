import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel: amqp.Channel;

export async function setupRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672');
    channel = await connection.createChannel();

    // Declare queues
    await channel.assertQueue('customer_data', { durable: true });
    await channel.assertQueue('order_data', { durable: true });
    await channel.assertQueue('campaign_delivery', { durable: true });

    console.log('RabbitMQ queues initialized');
  } catch (error) {
    console.error('Failed to setup RabbitMQ:', error);
    throw error;
  }
}

export async function publishToQueue(queueName: string, data: any) {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    const message = Buffer.from(JSON.stringify(data));
    channel.sendToQueue(queueName, message, { persistent: true });
  } catch (error) {
    console.error(`Failed to publish to queue ${queueName}:`, error);
    throw error;
  }
}

export async function consumeFromQueue(queueName: string, callback: (data: any) => Promise<void>) {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const data = JSON.parse(msg.content.toString());
          await callback(data);
          channel.ack(msg);
        } catch (error) {
          console.error(`Error processing message from ${queueName}:`, error);
          // Reject the message and requeue it
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error(`Failed to consume from queue ${queueName}:`, error);
    throw error;
  }
} 