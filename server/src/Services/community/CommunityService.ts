// TODO: Replace with your domain-specific service implementation
import { ICommunityService } from "../../Domain/services/community/ICommunityService";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { CommunityDto } from "../../Domain/DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../Domain/DTOs/community/CreateCommunityDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { CommunityType } from "../../Domain/enums/CommunityType";
import { CommunityMapper } from "../../Shared/mappers/community/CommunityMapper";
import { GetCommunitiesDto } from "../../Domain/DTOs/community/GetCommunitiesDto";
import { GetCommunitiesByUserIdDto } from "../../Domain/DTOs/community/GetCommunitiesByUserIdDto";
import { UpdateCommunityDto } from "../../Domain/DTOs/community/UpdateCommunityDto";

export class CommunityService implements ICommunityService {
  public constructor(private readonly communityRepo: ICommunityRepository) {}

  async getAll(dto : GetCommunitiesDto): Promise<PaginatedListDto<CommunityDto>> {
    const items = await this.communityRepo.findAll(dto);
    return new PaginatedListDto(items.communities, items.total, dto.page, dto.limit);
  }

  async getById(id: number): Promise<CommunityDto | null> {
    return this.communityRepo.findById(id);
  }

  async getByUserId(dto:GetCommunitiesByUserIdDto):  Promise<PaginatedListDto<CommunityDto>> {
    const items = await this.communityRepo.findByUserId(dto);
    return new PaginatedListDto(items.communities, items.total, dto.page, dto.limit);
    }

  async create(dto: CreateCommunityDto): Promise<CommunityDto | null> {
    const created = await this.communityRepo.create(dto);
    if (created.id === 0) return null;
    return CommunityMapper.toDtoFromModel(created);
  }

  async update(id: number, dto: UpdateCommunityDto): Promise<boolean> {
    return this.communityRepo.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.communityRepo.delete(id);
  }
}
