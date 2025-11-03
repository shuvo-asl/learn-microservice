import { ACCOUNT_TOPICS } from "../../constants";
import { KafkaMessage, BaseProducer } from "./base.producer";

export interface AccountCreatedData {
    id: number;
}
export class AccountCreatedProducer extends BaseProducer<AccountCreatedData> {
    protected readonly topic = ACCOUNT_TOPICS.ACCOUNT_CREATED;
}
const accountCreatedProducer = new AccountCreatedProducer();

export const publishAccountCreated = async (
    data: KafkaMessage<AccountCreatedData>,
): Promise<void> => accountCreatedProducer.publish(data);