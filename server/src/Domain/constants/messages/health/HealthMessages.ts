export const HealthMessages = {
  serverHealthy: "Server is running",
  serverHealthFailed: "Failed to check server health",

  dbHealthFetched: "Database health status fetched successfully",
  dbHealthFetchFailed: "Failed to fetch database health status",

  failoverSuccess: "Database failover completed successfully",
  failoverFailed: "Failed to perform database failover",

  noHealthySlave: "No healthy slave node available for failover",
} as const;