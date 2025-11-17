import { Router } from "express";
import AccountController from "../controllers/account.controller";
const accountRouter = Router();
const accountController = new AccountController();

// Define your routes here
accountRouter.get("/", accountController.getAllAccounts.bind(accountController));
accountRouter.get("/:acc_number", accountController.getAccountByAccountNumber.bind(accountController));
accountRouter.post("/", accountController.createAccount.bind(accountController));
accountRouter.delete("/:acc_number", accountController.deleteAccountByAccountNumber.bind(accountController));
accountRouter.post('/internal/transaction', accountController.internalTransaction.bind(accountController));
export { accountRouter };