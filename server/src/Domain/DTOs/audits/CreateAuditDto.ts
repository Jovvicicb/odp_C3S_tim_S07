export class CreateAuditDto {
  constructor(
    public userId: number | null,
    public action: string,
    public details: string,
    public ipAddress: string
  ) {}
}


