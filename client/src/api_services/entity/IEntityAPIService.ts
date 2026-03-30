// TODO: Replace EntityDto and CreateEntityDto with your domain types
import type { EntityDto } from "../../models/entity/EntityDto";

export type ApiResponse<T> = { success: boolean; message: string; data?: T };

export interface IEntityAPIService {
  getAll(page?: number, limit?: number): Promise<ApiResponse<{ items: EntityDto[]; total: number }>>;
  getById(id: number): Promise<ApiResponse<EntityDto>>;
  getByUserId(userId: number): Promise<ApiResponse<EntityDto[]>>;
  create(payload: Record<string, unknown>): Promise<ApiResponse<EntityDto>>;
  update(id: number, payload: Partial<EntityDto>): Promise<ApiResponse<void>>;
  delete(id: number): Promise<ApiResponse<void>>;
}
