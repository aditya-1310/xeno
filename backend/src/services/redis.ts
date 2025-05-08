import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: ReturnType<typeof createClient>;

export async function setupRedis() {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisClient.on('connect', () => console.log('Redis Client Connected'));

    await redisClient.connect();
  } catch (error) {
    console.error('Failed to setup Redis:', error);
    throw error;
  }
}

export async function setCache(key: string, value: any, expirySeconds?: number) {
  try {
    const stringValue = JSON.stringify(value);
    if (expirySeconds) {
      await redisClient.set(key, stringValue, { EX: expirySeconds });
    } else {
      await redisClient.set(key, stringValue);
    }
  } catch (error) {
    console.error(`Failed to set cache for key ${key}:`, error);
    throw error;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Failed to get cache for key ${key}:`, error);
    throw error;
  }
}

export async function addToBatch(key: string, value: any) {
  try {
    await redisClient.rPush(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to add to batch ${key}:`, error);
    throw error;
  }
}

export async function processBatch(key: string, batchSize: number = 100): Promise<any[]> {
  try {
    const items = await redisClient.lRange(key, 0, batchSize - 1);
    if (items.length > 0) {
      await redisClient.lTrim(key, items.length, -1);
    }
    return items.map(item => JSON.parse(item));
  } catch (error) {
    console.error(`Failed to process batch ${key}:`, error);
    throw error;
  }
}

export async function clearCache(key: string) {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`Failed to clear cache for key ${key}:`, error);
    throw error;
  }
} 