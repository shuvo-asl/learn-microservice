import { Kafka, Producer, Partitioners } from "kafkajs";
import { getLogger } from "@mbank/logger";

const logger = getLogger("kafka-client", 'info');

class KafkaClient {
    private readonly kafka: Kafka;
    private producer: Producer;
    private isConnected: boolean = false;

    constructor(clientId: string, brokers: string[], options = {
        allowAutoTopicCreation: true,
        createPartitioner: Partitioners.DefaultPartitioner,
    }) {
        this.kafka = new Kafka({
            clientId,
            brokers,
        });
        this.producer = this.kafka.producer(options);
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.producer.on("producer.connect", () => {
            logger.info("Kafka producer connected");
        });

        this.producer.on("producer.disconnect", () => {
            logger.info("Kafka producer disconnected");
        });

        this.producer.on("producer.network.request_timeout", (e) => {
            logger.error("Kafka producer request timeout", { error: e });
        });
    }
    public getProducer(): Producer {
        return this.producer;
    }
    public createConsumer(groupId: string) {
        return this.kafka.consumer({ groupId });
    }

    public isReady(): boolean {
        return this.isConnected;
    }

    public async connect(): Promise<void> {
        try {
            await this.producer.connect();
        } catch (error) {
            logger.error("Failed to connect Kafka producer", error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.producer.disconnect();
        } catch (error) {
            logger.error("Failed to disconnect Kafka producer", error);
            throw error;
        }
    }

}

export default KafkaClient;


export interface KafkaMessage<T> {
    key: string;
    value: T;
}


export abstract class BaseProducer<T> {
    protected abstract readonly topic: string;
    private producer: Producer;

    constructor(producer: Producer) {
        this.producer = producer;
    }

    async publish(data: KafkaMessage<T>): Promise<void> {
        try {
            logger.info(
                `publishing message to topic: ${this.topic} with message: ${JSON.stringify(data)}`,
            );

            await this.producer.send({
                topic: this.topic,
                messages: [
                    {
                        key: data.key,
                        value: JSON.stringify(data.value),
                    },
                ],
            });

            logger.debug(`message published successfully to topic: ${this.topic}`);
        } catch (error) {
            logger.error(
                `failed to publish message to topic ${this.topic}: ${error}`,
            );

            throw error;
        }
    }
}