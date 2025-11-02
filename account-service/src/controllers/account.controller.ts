import { Request, Response, NextFunction } from "express";
import AccountService from "../services/account.service";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email().max(50),
    password: z.string().min(6).max(100),
    firstName: z.string().max(50),
    lastName: z.string().max(50),
});

class AccountController {
    private accountService: AccountService;

    constructor() {
        this.accountService = new AccountService();
    }
}

export default AccountController