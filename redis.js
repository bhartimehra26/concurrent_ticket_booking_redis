import { createClient } from 'redis';
let client;

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'; 

export const connectRedis = async () => {
    client = createClient({
        url: REDIS_URL
    });

    client.on('error', (err) => console.error('Redis Client Error', err));

    await client.connect();
    console.log('Connected to Redis');
};

export const getRedisClient = () => {
    if (!client) throw new Error('Redis client not connected');
    return client;
};
