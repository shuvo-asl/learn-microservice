import { config } from ".";
import RedisClient from "@mbank/redis-client";

const redisClient = new RedisClient(config.REDIS_URL);

export default redisClient.getInstance();