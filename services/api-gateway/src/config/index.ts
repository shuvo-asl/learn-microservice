interface Config {
    SERVICE_NAME: string;
    PORT: number;
    DEFAULT_TIMEOUT: number;
    REDIS_URL: string;
    AUTH_JWT_SECRET: string;
    GATEWAY_JWT_SECRET: string;
    GATEWAY_JWT_EXPIRES_IN: string;
    RATE_LIMIT_WINDOW: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    LOG_LEVEL: string;
    AUTH_SERVICE_URL: string;
    ACCOUNTS_SERVICE_URL: string;
    TRANSACTION_SERVICE_URL: string;
}

export const config: Config = {
    SERVICE_NAME: require('../../package.json').name,
    PORT: parseInt(process.env.PORT || '3000', 10),
    DEFAULT_TIMEOUT: parseInt(process.env.DEFAULT_TIMEOUT || '5000', 10),
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET || 'your_auth_jwt_secret',
    GATEWAY_JWT_SECRET: process.env.GATEWAY_JWT_SECRET || 'your_gateway_jwt_secret',
    GATEWAY_JWT_EXPIRES_IN: process.env.GATEWAY_JWT_EXPIRES_IN || '1h',
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10), // 1 minute
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 100 requests per window
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    ACCOUNTS_SERVICE_URL: process.env.ACCOUNTS_SERVICE_URL || 'http://localhost:3002',
    TRANSACTION_SERVICE_URL: process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003',
};