export const HealthMessages = {
  serverHealthy: "Server is running",
  serverHealthFailed: "Failed to check server health",

  dbHealthFetched: "Database health status fetched successfully",
  dbHealthFetchFailed: "Failed to fetch database health status",  

  failoverSuccess: "Failover completed successfully",
  failoverFailed: "Failed to perform failover",
  noHealthySlave: "No healthy slave available for failover",
} as const;