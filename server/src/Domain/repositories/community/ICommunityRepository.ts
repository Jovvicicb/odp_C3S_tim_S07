import { Community } from "../../models/Community";
import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";
import { UpdateCommunityDto } from "../../DTOs/community/UpdateCommunityDto";
import { CommunityType } from "../../enums/communities/CommunityType";

export interface ICommunityRepository {
  findById(id: number): Promise<Community>;
  findByIds(ids: number[]): Promise<Community[]>;
  findByName(name: string): Promise<Community>;
  findIdsByType(type: CommunityType): Promise<number[]>;
  findAll(page: number, limit: number, type?: CommunityType): Promise<{communities:Community[];total:number}>;
  discover(page: number, limit: number, type: CommunityType | null, search: string | null): Promise<{ communities: Community[]; total: number }>;
  create(dto: CreateCommunityDto): Promise<Community>;
  update(id: number, dto: UpdateCommunityDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
 