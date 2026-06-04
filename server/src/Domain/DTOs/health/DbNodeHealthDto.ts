import { DbNodeRole } from "../../enums/nodes/DbNodeRole";
import { NodeStatus } from "../../enums/nodes/NodeStatus";

export class DbNodeHealthDto {
  public constructor(
    public name: string,
    public role: DbNodeRole,
    public host: string,
    public port: number,
    public status: NodeStatus,
    public lastCheck: Date,
    public canServeReads: boolean,
    public successfulReads: number,
    public failedReads: number,
    public successfulWrites: number,
    public failedWrites: number
  ) {}
}