import winston from "winston";
import { config } from ".";

const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    defaultMeta: { service: config.SERVICE_NAME },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, service }) => {
            return `[${timestamp}] [${level}] [${service}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

export { logger };