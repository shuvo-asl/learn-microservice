import { logger } from "../../config/logger";
import { producer } from "../kafka";
import { USER_TOPICS } from "../../constants";

export const publishUserRegistered = async (data: any) => {
    const topic = USER_TOPICS.USER_REGISTERED;
    logger.info(`Publishing to topic ${topic} with message: ${data}`);
    try {
        await producer.send({
            topic,
            messages: [
                {
                    key: data.key,
                    value: JSON.stringify(data.value)
                },
            ],
        });
        logger.info(`User registered event published`, { data });
    } catch (error) {
        logger.error("Error publishing user registered event", { error, data });
        throw error;
    }
};