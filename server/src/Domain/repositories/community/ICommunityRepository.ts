import { Community } from "../../models/Community";
import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";
import { GetCommunitiesByUserIdDto } from "../../DTOs/community/GetCommunitiesByUserIdDto";
import { UpdateCommunityDto } from "../../DTOs/community/UpdateCommunityDto";
import { CommunityType } from "../../enums/communities/CommunityType";

export interface ICommunityRepository {
  findById(id: number): Promise<Community>;
  findByName(name: string): Promise<Community>;
  findAll(page: number, limit: number, type?: CommunityType): Promise<{communities:Community[];total:number}>;
  findByUserId(dto:GetCommunitiesByUserIdDto): Promise<{communities:Community[];total:number}>;
  create(dto: CreateCommunityDto): Promise<Community>;
  update(id: number, dto: UpdateCommunityDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
 