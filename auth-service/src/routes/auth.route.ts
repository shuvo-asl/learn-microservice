import { Router } from "express";
const authRoutes = Router();

// Define your routes here
authRoutes.get("/", (req, res) => {
    res.status(200).json({ message: "Auth Service V1 is running" });
});


export { authRoutes };