import { Community } from "../../models/Community";
import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";
import { GetCommunitiesDto } from "../../DTOs/community/GetCommunitiesDto";
import { GetCommunitiesByUserIdDto } from "../../DTOs/community/GetCommunitiesByUserIdDto";
import { UpdateCommunityDto } from "../../DTOs/community/UpdateCommunityDto";

export interface ICommunityRepository {
  findById(id: number): Promise<Community>;
  findAll(dto:GetCommunitiesDto): Promise<{communities:Community[];total:number}>;
  findByUserId(dto:GetCommunitiesByUserIdDto): Promise<{communities:Community[];total:number}>;
  create(dto: CreateCommunityDto): Promise<Community>;
  update(id: number, dto: UpdateCommunityDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
