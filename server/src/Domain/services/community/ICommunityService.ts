import { CommunityDto } from "../../DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";
import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { GetCommunitiesDto } from '../../DTOs/community/GetCommunitiesDto';
import { GetCommunitiesByUserIdDto } from "../../DTOs/community/GetCommunitiesByUserIdDto";
import { UpdateCommunityDto } from "../../DTOs/community/UpdateCommunityDto";
import { CreateCommunityResponseDto } from "../../DTOs/community/CreateCommunityResponseDto";

export interface ICommunityService {
  getAll(dto:GetCommunitiesDto): Promise<PaginatedListDto<CommunityDto>>;
  getById(id: number): Promise<CommunityDto | null>;
  getByUserId(dto:GetCommunitiesByUserIdDto): Promise<PaginatedListDto<CommunityDto>>;
  create(dto: CreateCommunityDto): Promise<CreateCommunityResponseDto | null>;
  update(id: number, dto: UpdateCommunityDto): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
