
// Third party modules
import jwt from 'jsonwebtoken'
import { Repository } from 'typeorm';
import { Account, AccountType, TransactionType } from '../entity/account.entity';

// Local modules
import { AppDataSource } from '../data-source';
import { createError } from '../utils';
import { publishAccountCreated } from '../events/producers/accountCreated.producer';
import { logger } from '../config/logger';
import { generateAccountNumber } from '../utils';
import { publishAccountDeleted } from '../events/producers/accountDeleted.producer';

interface AccountCreateDTO {
    userId: number;
    accountType: AccountType;
    accountName: string;
}

interface UpdateBalanceDTO {
    userId: number;
    accountNumber: string;
    amount: number;
    type: TransactionType;
}

class AccountService {
    accountRepository: Repository<Account>

    constructor() {
        this.accountRepository = AppDataSource.getRepository(Account)
    }
    async create({ userId, accountType, accountName }: AccountCreateDTO) {
        const existingAccount = await this.accountRepository.findOneBy({ userId, accountType });

        if (existingAccount) {
            throw createError('Account of this type already exists for the user', 400)
        }

        const account = new Account();
        account.userId = userId;
        account.accountNumber = generateAccountNumber(accountType);
        account.accountType = accountType;
        account.accountName = accountName;
        account.balance = 0;

        await this.accountRepository.save(account);

        await publishAccountCreated({
            key: userId.toString(),
            value: account
        })

        return account;
    }

    async listByUserId(userId: number) {
        const accounts = await this.accountRepository.findBy({ userId });
        return accounts;
    }

    async getByAccountNumber(accountNumber: string) {
        const account = await this.accountRepository.findOneBy({ accountNumber });
        if (!account) {
            throw createError('Account not found', 404);
        }
        return account;
    }

    async deleteByAccountNumber(userId: number, accountNumber: string) {
        const account = await this.accountRepository.findOneBy({ userId, accountNumber });
        if (!account) {
            throw createError('Account not found', 404);
        }
        const deleteRes = await this.accountRepository.delete({ userId, accountNumber });
        if (deleteRes.affected === 0) {
            throw createError('Failed to delete account', 500);
        } else if (deleteRes.affected === 1) {
            logger.info(`Account ${accountNumber} deleted successfully for user ${userId}`);
            publishAccountDeleted({
                key: userId.toString(),
                value: account
            });
        }
        else {
            logger.error(`Account ${accountNumber} deletion failed for user ${userId}`, deleteRes);
            throw createError('Failed to delete account', 500);
        }
    }
    async updateBalance({ userId, accountNumber, amount, type }: UpdateBalanceDTO) {
        const account = await this.accountRepository.findOneBy({ userId, accountNumber });
        if (!account) {
            throw createError('Account not found', 404);
        }

        if (type === TransactionType.DEBIT) {
            if (account.balance < amount) {
                throw createError('Insufficient balance', 400);
            }
            account.balance -= amount;
        } else if (type === TransactionType.CREDIT) {
            account.balance += amount;
        } else {
            throw createError('Invalid transaction type', 400);
        }
        account.balance = Number(account.balance.toFixed(2));
        await this.accountRepository.save(account);
        return account;
    }


}

export default AccountService;