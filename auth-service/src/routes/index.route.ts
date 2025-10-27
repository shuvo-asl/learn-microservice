import { Router } from "express";
const indexRoutes = Router();

// Define your routes here
indexRoutes.get("/", (req, res) => {
    res.status(200).json({ message: "Auth Service is running" });
});

// Health check endpoint
indexRoutes.get('/health1', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export { indexRoutes };