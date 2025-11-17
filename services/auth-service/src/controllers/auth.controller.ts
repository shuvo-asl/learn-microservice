import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email().max(50),
    password: z.string().min(6).max(100),
    firstName: z.string().max(50),
    lastName: z.string().max(50),
});

const loginSchema = z.object({
    email: z.string().email().max(50),
    password: z.string().min(6).max(100),
})

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }
    async register(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { firstName, lastName, email, password } = registerSchema.parse(req.body)
        const user = await this.authService.register({ firstName, lastName, email, password })
        return res.status(201).json(user);
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { email, password } = loginSchema.parse(req.body);
        const user = await this.authService.login(email, password);
        return res.status(200).json(user);
    }

    async logout(req: Request, res: Response): Promise<any> {
        await this.authService.logout(req.userId!, req.token);

        return res.status(200).json({ message: 'logged out successfully' });
    }
}

export default AuthController