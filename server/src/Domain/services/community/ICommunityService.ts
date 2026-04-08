import { CommunityDto } from "../../DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../DTOs/community/CreateCommunityDto";
import { PaginatedListDto } from "../../DTOs/community/PaginatedListDto";
import { CommunityType } from "../../enums/CommunityType";

export interface ICommunityService {
  getAll(page: number, limit: number,type?:CommunityType): Promise<PaginatedListDto<CommunityDto>>;
  getById(id: number): Promise<CommunityDto | null>;
  getByOwnerId(userId: number,page:number,limit:number): Promise<PaginatedListDto<CommunityDto>>;
  create(dto: CreateCommunityDto): Promise<CommunityDto | null>;
  update(id: number, fields: Partial<CommunityDto>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
