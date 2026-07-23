import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client only if REDIS_URL is provided, allowing graceful fallback
let redisClient = null;

if (process.env.REDIS_URL) {
    try {
        redisClient = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: 1, // Don't hang indefinitely if Redis is down
            retryStrategy(times) {
                if (times > 3) {
                    console.error('Redis connection failed after 3 retries, giving up.');
                    return null; // Stop retrying
                }
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        redisClient.on('error', (err) => {
            console.error('Redis Error:', err.message);
        });
        
        redisClient.on('connect', () => {
            console.log('Successfully connected to Redis.');
        });
    } catch (err) {
        console.error("Failed to initialize Redis client:", err);
        redisClient = null;
    }
} else {
    console.warn("No REDIS_URL found in environment. Redis caching will be disabled.");
}

export default redisClient;
