import { USER_TOPICS } from "@mbank/constants";
import { producer } from "../kafka";
import { KafkaMessage, BaseProducer } from "@mbank/kafka-client";


export interface AccountDeletedData {
    id: number;
}

export class AccountDeletedProducer extends BaseProducer<AccountDeletedData> {
    protected readonly topic = USER_TOPICS.ACCOUNT_DELETED;
    constructor() {
        super(producer);
    }
}

const accountDeletedProducer = new AccountDeletedProducer();

export const publishAccountDeleted = async (
    data: KafkaMessage<AccountDeletedData>,
): Promise<void> => accountDeletedProducer.publish(data);