// TODO: Replace with your domain-specific DTO fields
import { EntityStatus } from "../../enums/EntityStatus";

export class EntityDto {
  constructor(
    public id: number            = 0,
    public userId: number        = 0,
    public status: EntityStatus  = EntityStatus.PENDING,
    public createdAt: Date       = new Date(),
  ) {}
}
