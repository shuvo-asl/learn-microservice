import { USER_TOPICS } from "@mbank/constants";
import { KafkaMessage, BaseProducer } from "@mbank/kafka-client";
import { producer } from "../kafka";

export interface AccountCreatedData {
    id: number;
}
export class UserRegisteredProducer extends BaseProducer<AccountCreatedData> {
    protected readonly topic = USER_TOPICS.USER_REGISTERED;
    constructor() {
        super(producer);
    }
}

const userRegisteredProducer = new UserRegisteredProducer();

export const publishUserRegistered = async (
    data: KafkaMessage<AccountCreatedData>,
): Promise<void> => userRegisteredProducer.publish(data);