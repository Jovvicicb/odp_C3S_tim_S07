const parsedHealthInterval = Number(process.env.DB_HEALTH_INTERVAL_MS);

export const HEALTH_CHECK_TIMEOUT_MS = 2000;

export const HEALTH_CHECK_INTERVAL_MS =
  Number.isInteger(parsedHealthInterval) && parsedHealthInterval > 0
    ? parsedHealthInterval
    : 10000;

export const HEALTH_DEGRADED_THRESHOLD_MS = 500;