import { config } from "../config";
import { logger } from "../config/logger";
import KafkaClient from "@mbank/kafka-client";


const kafkaClient = new KafkaClient(
    config.SERVICE_NAME,
    [config.KAFKA_BROKER],
);

const producer = kafkaClient.getProducer();

export const connectKafka = async () => {
    try {
        await kafkaClient.connect();
        logger.info("Kafka producer connected");
    } catch (error) {
        logger.error("Error connecting Kafka producer", { error });
        throw error;
    }
}

process.on('SIGINT', async () => {
    try {
        await kafkaClient.disconnect();
        logger.info("Kafka producer disconnected");
        process.exit(0);
    } catch (error) {
        logger.error("Error disconnecting Kafka producer", { error });
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    try {
        await kafkaClient.disconnect();
        logger.info("Kafka producer disconnected");
        process.exit(0);
    } catch (error) {
        logger.error("Error disconnecting Kafka producer", { error });
        process.exit(1);
    }
});

export { producer };