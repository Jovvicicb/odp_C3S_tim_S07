import { Community } from "../../models/Community";
import { CommunityDto } from "../../DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";

export interface ICommunityRepository {
  findById(id: number): Promise<CommunityDto | null>;
  findAll(page?: number, limit?: number): Promise<CommunityDto[]>;
  findByOwnerId(userId: number): Promise<CommunityDto[]>;
  create(dto: CreateCommunityDto): Promise<Community>;
  update(id: number, fields: Partial<Community>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
