import { Request, Response, NextFunction } from "express";
import AccountService from "../services/account.service";
import { z } from "zod";
import { AccountType, TransactionType } from "../entity/account.entity";
import { SAVINGS_ACCOUNT } from "../constants";

const accountSchema = z.object({
    accountType: z.nativeEnum(AccountType)
        .optional()
        .default(AccountType.SAVINGS),
    accountName: z.string().optional().default(SAVINGS_ACCOUNT),
});

const transactionSchema = z.object({
    accountNumber: z.string().length(15),
    amount: z.number().positive().multipleOf(0.01),
    type: z.nativeEnum(TransactionType)
});

class AccountController {
    private accountService: AccountService;

    constructor() {
        this.accountService = new AccountService();
    }

    async createAccount(req: Request, res: Response, next: NextFunction) {
        const { accountType, accountName } = accountSchema.parse(req.body);
        const account = await this.accountService.create({
            userId: req.userId,
            accountType,
            accountName
        });
        return res.status(201).json(account);
    }

    async getAllAccounts(req: Request, res: Response, next: NextFunction) {
        const accounts = await this.accountService.listByUserId(req.userId);
        return res.status(200).json(accounts);
    }

    async getAccountByAccountNumber(req: Request, res: Response, next: NextFunction) {
        const { acc_number } = req.params;
        const account = await this.accountService.getByAccountNumber(acc_number);
        return res.status(200).json(account);
    }
    async deleteAccountByAccountNumber(req: Request, res: Response, next: NextFunction) {
        await this.accountService.deleteByAccountNumber(req.userId, req.params.acc_number);

        return res.status(200).json({ message: 'account deleted' });
    }

    async internalTransaction(req: Request, res: Response, next: NextFunction) {
        const { accountNumber, amount, type } = transactionSchema.parse(req.body);

        const account = await this.accountService.updateBalance({
            userId: req.userId,
            accountNumber,
            amount,
            type
        });
        return res.status(200).json({
            message: `Account transaction ${type} completed`,
            availableBalance: account.balance,
        });
    }

}

export default AccountController