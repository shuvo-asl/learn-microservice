
// Third party modules
import jwt from 'jsonwebtoken'
import ms from 'ms'
import bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { Account } from '../entity/account.entity';

// Local modules
import { AppDataSource } from '../data-source';
import { createError } from '../utils';
import { publishAccountCreated } from '../events/producers/accountCreated.producer';
import { config } from '../config';
import redis, { RedisClient } from '../config/redis';
import { logger } from '../config/logger';

interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

class AccountService {
    accountRepository: Repository<Account>

    constructor() {
        this.accountRepository = AppDataSource.getRepository(Account)
    }

}

export default AccountService;