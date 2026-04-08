import { Community } from "../../models/Community";
import { CommunityDto } from "../../DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";
import { CommunityType } from "../../enums/CommunityType";

export interface ICommunityRepository {
  findById(id: number): Promise<CommunityDto | null>;
  findAll(page: number, limit: number,type?:CommunityType): Promise<{communities:CommunityDto[];total:number}>;
  findByOwnerId(ownerId: number,page:number,limit:number): Promise<{communities:CommunityDto[];total:number}>;
  create(dto: CreateCommunityDto): Promise<Community>;
  update(id: number, fields: Partial<Community>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
