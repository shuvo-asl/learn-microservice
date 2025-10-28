
// Third party modules
import jwt from 'jsonwebtoken'
import ms from 'ms'
import bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Credential } from '../entity/credential.entity';

// Local modules
import { AppDataSource } from '../data-source';
import { createError } from '../utils';
import { publishUserRegistered } from '../events/producers/userRegistered.producer';
import { config } from '../config';
import redis, { RedisClient } from '../config/redis';
import { logger } from '../config/logger';

interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

class AuthService {
    userRepository: Repository<User>
    credentialRepository: Repository<Credential>

    constructor() {
        this.userRepository = AppDataSource.getRepository(User)
        this.credentialRepository = AppDataSource.getRepository(Credential)
    }

    async register({ firstName, lastName, email, password }: RegisterDto) {
        const existing = await this.credentialRepository.findOneBy({ email })

        if (existing) {
            throw createError('email already in use', 400)
        }
        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        await this.userRepository.save(user);


        const passwordHash = await bcrypt.hash(password, 10)

        const credential = new Credential()
        credential.email = email
        credential.passwordHash = passwordHash
        credential.user = user

        await this.credentialRepository.save(credential)

        await publishUserRegistered({
            key: user.id?.toString(),
            value: user
        })
        return user;
    }

    async login(email: string, password: string) {
        const credential = await this.credentialRepository.findOne({
            where: { email },
            relations: ['user']
        })

        if (!credential) {
            throw createError('invalid email or password', 401)
        }

        const isPasswordValid = await bcrypt.compare(password, credential.passwordHash)

        if (!isPasswordValid) {
            throw createError('invalid email or password', 401)
        }
        const token = jwt.sign(
            {
                id: credential.user.id,
                email: credential.user.email,
                firstName: credential.user.firstName,
                lastName: credential.user.lastName,
            },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN as ms.StringValue },
        );
        if (!RedisClient['isConnected']) {
            logger.warn('Redis not connected yet. Skipping token storage.');
        } else {
            await redis.setex(`auth:${credential.user.id}:${token}`, 24 * 60 * 60, 'true');
        }
        return {
            token,
            firstName: credential.user.firstName,
            lastName: credential.user.lastName,
            email: credential.email,
        };
    }
    async logout(userId: number, token: string) {
        await redis.del(`auth:${userId}:${token}`);
    }
}

export default AuthService;