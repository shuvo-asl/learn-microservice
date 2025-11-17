import { USER_TOPICS } from "@mbank/constants";
import { KafkaMessage, BaseProducer } from "@mbank/kafka-client";
import { producer } from "../kafka";

export interface AccountCreatedData {
    id: number;
}
export class AccountCreatedProducer extends BaseProducer<AccountCreatedData> {
    protected readonly topic = USER_TOPICS.ACCOUNT_CREATED;
    constructor() {
        super(producer);
    }
}

const accountCreatedProducer = new AccountCreatedProducer();

export const publishAccountCreated = async (
    data: KafkaMessage<AccountCreatedData>,
): Promise<void> => accountCreatedProducer.publish(data);