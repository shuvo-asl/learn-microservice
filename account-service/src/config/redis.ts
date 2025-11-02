import Redis from "ioredis";
import { config } from ".";
import { logger } from "./logger";

class RedisClient {
    private static instance: Redis;
    private static isConnected: boolean = false;

    private constructor() { }

    public static getInstance(): Redis {
        if (!RedisClient.instance) {
            RedisClient.instance = new Redis(config.REDIS_URL, {
                retryStrategy(times: number) {
                    const delay = Math.min(times * 50, 2000);
                    logger.warn(`Redis reconnect attempt #${times}, retrying in ${delay}ms`);
                    return delay;
                },
                maxRetriesPerRequest: 3,
            });
            // Handle connection events
            RedisClient.setupEventListeners();
        }
        return RedisClient.instance;
    }
    private static setupEventListeners() {

        RedisClient.instance.on("connect", () => {
            logger.info("Connecting to Redis...");
        });

        RedisClient.instance.on("ready", () => {
            RedisClient.isConnected = true;
            logger.info("Connected to Redis successfully.");
        });

        RedisClient.instance.on("error", (error) => {
            RedisClient.isConnected = false;
            logger.error(`Redis error: ${error.message}`);
        });

        RedisClient.instance.on("close", () => {
            RedisClient.isConnected = false;
            logger.warn("Redis connection closed.");
        });

        RedisClient.instance.on("reconnecting", () => {
            logger.info(`Reconnecting to Redis...`);
        });
    }
    public static async closeConnection() {
        if (RedisClient.instance) {
            try {
                await RedisClient.instance.quit();
                logger.info("Redis connection closed gracefully.");
            } catch (error) {
                logger.error(`Error closing Redis connection:`, error);
            }
        }
    }
}

export default RedisClient.getInstance();
export { RedisClient };