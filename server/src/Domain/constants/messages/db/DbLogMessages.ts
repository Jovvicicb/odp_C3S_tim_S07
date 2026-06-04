export const DbLogMessages = {
  failoverAlreadyInProgress: "Failover already in progress",
  writeBlockedFailoverInProgress: "Write blocked - failover is in progress",
  masterOfflineWriteNotPossible: "Master is OFFLINE — write not possible",
  failedToConnectToMaster: "Failed to connect to master",
  noReadableSlavesFallbackMaster: "No readable slaves available — falling back to master",
  masterAlsoOfflineReadNotPossible: "Master also offline — read not possible",
  failedToConnectToMasterForRead: "Failed to connect to master for fallback read",
  automaticFailoverNoHealthySlave: "Automatic failover failed - no healthy slave available",
  failoverNoHealthySlave: "Failover failed - no healthy slave available",
} as const;