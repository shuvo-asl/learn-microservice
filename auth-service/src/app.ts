// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

// Suppress the KafkaJS timeout warning (known issue)
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name !== 'TimeoutNegativeWarning') {
        console.warn(warning.name, warning.message);
    }
});

// Third party imports
import express from 'express';
import helmet from 'helmet';
// Local imports
import { logger } from './config/logger';
import { config } from './config';
import { indexRoutes, authRoutes } from './routes'
import init from './init';
import { AppDataSource } from './data-source';

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());

// Routes
app.use('/', indexRoutes);
app.use('/api/v1/auth', authRoutes);


// Initialize database and other services
AppDataSource.initialize()
    .then(async () => {
        logger.info('Data Source has been initialized!');
        await init();
        const server = app.listen(config.PORT, () => {
            logger.info(
                `${config.SERVICE_NAME} is running on http://localhost:${config.PORT}`,
            );
        });
    })
    .catch((err) => {
        logger.error('Error during Data Source initialization:', err);
    });
