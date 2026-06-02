import { NodeStatus } from "../enums/nodes/NodeStatus";

export class DbNode {
  public status: NodeStatus    = NodeStatus.OFFLINE;
  public lastCheck: Date       = new Date();

  public successfulReads: number = 0;
  public failedReads: number = 0;

  public successfulWrites: number = 0;
  public failedWrites: number  = 0;

  constructor(
    public readonly name: string,
    public readonly host: string,
    public readonly port: number,
  ) {}
}
