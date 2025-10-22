// Third party imports
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

// Local imports
import { logger } from "./config/logger";
import { config } from "./config";
import { log } from 'console';
import { rateLimitMiddleware } from './middlewares/rate-limiter.middleware';
import { proxyServices } from './config/services';

dotenv.config();
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimitMiddleware);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
});

// Service routes
proxyServices(app);


// 404 handler
app.use((req: Request, res: Response) => {
    logger.warn(`Resource not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Resources not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
});


const startServer = () => {
    try {
        const PORT = process.env.PORT;
        const serviceName = config.SERVICE_NAME;

        app.listen(PORT, () => {
            logger.info(`${serviceName} is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Error starting server:`, error);
        process.exit(1);
    }
};

startServer();
