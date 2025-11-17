import { Router, Request, Response } from "express";
const indexRoutes = Router();
import { config } from "../config";

// Define your routes here
indexRoutes.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Auth Service is running" });
});

// Health check endpoint
indexRoutes.get('/health', (req: Request, res: Response) => {
    res.status(200).json(
        {
            service: config.SERVICE_NAME,
            status: 'OK'
        }
    );
});

export { indexRoutes };