
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
            return createError('email already in use', 400)
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
}

export default AuthService;