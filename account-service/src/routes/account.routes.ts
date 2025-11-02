import { Router } from "express";
import AccountController from "../controllers/account.controller";
const accountRoutes = Router()
const accountController = new AccountController();

// Define your routes here


export { accountRoutes };