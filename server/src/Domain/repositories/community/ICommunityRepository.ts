import { Community } from "../../models/Community";
import { CommunityDto } from "../../DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";
import { GetCommunitiesDto } from "../../DTOs/community/GetCommunitiesDto";
import { GetCommunitiesByUserIdDto } from "../../DTOs/community/GetCommunitiesByUserIdDto";
import { UpdateCommunityDto } from "../../DTOs/community/UpdateCommunityDto";

export interface ICommunityRepository {
  findById(id: number): Promise<CommunityDto | null>;
  findAll(dto:GetCommunitiesDto): Promise<{communities:CommunityDto[];total:number}>;
  findByUserId(dto:GetCommunitiesByUserIdDto): Promise<{communities:CommunityDto[];total:number}>;
  create(dto: CreateCommunityDto): Promise<Community>;
  update(id: number, dto: UpdateCommunityDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
