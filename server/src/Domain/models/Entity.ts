// TODO: Replace "Entity" and its fields with your domain model
import { EntityStatus } from "../enums/EntityStatus";

export class Entity {
  constructor(
    public id: number            = 0,
    public userId: number        = 0,
    public status: EntityStatus  = EntityStatus.PENDING,
    public createdAt: Date       = new Date(),
  ) {}
}
