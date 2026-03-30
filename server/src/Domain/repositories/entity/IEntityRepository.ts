// TODO: Replace Entity / EntityDto with your domain types
import { Entity } from "../../models/Entity";
import { EntityDto } from "../../DTOs/entity/EntityDto";
import { CreateEntityDto } from "../../DTOs/entity/CreateEntityDto";

export interface IEntityRepository {
  findById(id: number): Promise<EntityDto | null>;
  findAll(page?: number, limit?: number): Promise<EntityDto[]>;
  findByUserId(userId: number): Promise<EntityDto[]>;
  create(dto: CreateEntityDto): Promise<Entity>;
  update(id: number, fields: Partial<Entity>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
