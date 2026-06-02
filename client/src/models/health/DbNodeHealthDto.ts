export type DbNodeRole = "master" | "slave";

export type DbNodeStatus = "healthy" | "degraded" | "offline";

export type DbNodeHealthDto = {
  name: string;
  role: DbNodeRole;
  host: string;
  port: number;
  status: DbNodeStatus;
  lastCheck: string;
  successfulReads: number;
  failedReads: number;
  successfulWrites: number;
  failedWrites: number;
};