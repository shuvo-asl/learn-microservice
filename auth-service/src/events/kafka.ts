import { Kafka, Partitioners } from "kafkajs";
import { config } from "../config";
import { logger } from "../config/logger";

const kafka = new Kafka({
    clientId: config.SERVICE_NAME,
    brokers: [config.KAFKA_BROKER],
    connectionTimeout: 3000,
    requestTimeout: 30000,
});

const producer = kafka.producer({
    allowAutoTopicCreation: true,
    createPartitioner: Partitioners.DefaultPartitioner,
    maxInFlightRequests: 1,
    idempotent: false,
    retry: {
        retries: 5,
    }
});

export const connectKafka = async () => {
    try {
        await producer.connect();
        logger.info("Kafka producer connected");
    } catch (error) {
        logger.error("Error connecting Kafka producer", { error });
        throw error;
    }
}

process.on('SIGINT', async () => {
    try {
        await producer.disconnect();
        logger.info("Kafka producer disconnected");
        process.exit(0);
    } catch (error) {
        logger.error("Error disconnecting Kafka producer", { error });
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    try {
        await producer.disconnect();
        logger.info("Kafka producer disconnected");
        process.exit(0);
    } catch (error) {
        logger.error("Error disconnecting Kafka producer", { error });
        process.exit(1);
    }
});

export { producer, logger };