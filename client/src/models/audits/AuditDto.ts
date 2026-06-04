export type AuditDto = {
  id: number;
  userId: number | null;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
};