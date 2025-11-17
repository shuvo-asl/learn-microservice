import { config } from ".";
import { getLogger } from "@mbank/logger";

const logger = getLogger(config.SERVICE_NAME, config.LOG_LEVEL);

export { logger };