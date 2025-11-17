import { Router } from "express";
import AuthController from "../controllers/auth.controller";
const authRoutes = Router()
const authController = new AuthController();

// Define your routes here
authRoutes.post("/register", authController.register.bind(authController));
authRoutes.post("/login", authController.login.bind(authController));
authRoutes.post("/logout", authController.logout.bind(authController));

export { authRoutes };