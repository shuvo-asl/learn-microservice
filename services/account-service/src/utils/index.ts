import { customAlphabet } from 'nanoid';
import { Account, AccountType } from '../entity/account.entity';
export const createError = (message: string, statusCode: number): Error => {
    return Object.assign(new Error(message), { statusCode });
};

const accountTypeMap = {
    [AccountType.SAVINGS]: 11,
    [AccountType.CURRENT]: 13,
}

export const generateAccountNumber = (accountType: AccountType, idLength: number = 7): string => {
    const prefix = accountTypeMap[accountType];
    const date = new Date().toISOString().slice(0, 4).replace(/-/g, '');
    const uniqueId = customAlphabet('0123456789', idLength)();
    return `${prefix}${date}${prefix}${uniqueId}`;
};

export const maskAccountNumber = (accountNumber: string): string => {
    if (accountNumber.length < 4) {
        return accountNumber;
    }
    const visibleDigits = accountNumber.slice(-4);
    const maskedSection = '*'.repeat(accountNumber.length - 4);
    return `${maskedSection}${visibleDigits}`;
};