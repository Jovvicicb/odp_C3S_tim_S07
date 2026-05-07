import { NodeStatus } from "../../enums/NodeStatus";

export class DbNodeHealthDto {
  public constructor(
    public name: string,
    public host: string,
    public port: number,
    public status: NodeStatus,
    public lastCheck: Date,
    public successfulWrites: number,
    public failedWrites: number
  ) {}
}