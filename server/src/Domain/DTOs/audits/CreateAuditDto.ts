export class CreateAuditDto {
  constructor(
    public userId: number,
    public action: string,
    public details: string,
    public ipAddress: string
  ) {}
}


