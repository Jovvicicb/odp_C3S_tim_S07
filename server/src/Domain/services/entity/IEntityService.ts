// TODO: Replace with your domain-specific service interface
import { EntityDto } from "../../DTOs/entity/EntityDto";
import { CreateEntityDto } from "../../DTOs/entity/CreateEntityDto";
import { PaginatedListDto } from "../../DTOs/entity/PaginatedListDto";

export interface IEntityService {
  getAll(page?: number, limit?: number): Promise<PaginatedListDto<EntityDto>>;
  getById(id: number): Promise<EntityDto | null>;
  getByUserId(userId: number): Promise<EntityDto[]>;
  create(dto: CreateEntityDto): Promise<EntityDto | null>;
  update(id: number, fields: Partial<EntityDto>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
