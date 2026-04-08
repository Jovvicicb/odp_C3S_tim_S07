// TODO: Replace with your domain-specific service implementation
import { ICommunityService } from "../../Domain/services/community/ICommunityService";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { CommunityDto } from "../../Domain/DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../Domain/DTOs/community/CreateCommunityDto";
import { PaginatedListDto } from "../../Domain/DTOs/community/PaginatedListDto";
import { Community } from "../../Domain/models/Community";
import { CommunityType } from "../../Domain/enums/CommunityType";

export class CommunityService implements ICommunityService {
  public constructor(private readonly communityRepo: ICommunityRepository) {}
 
  private toDto(c: Community): CommunityDto {
  return new CommunityDto(
    c.id,
    c.name,
    c.description,
    c.rules,
    c.type,
    c.ownerId,
    c.avatar,
    c.createdAt ?? new Date(),
    c.updatedAt ?? new Date()
  );
}

  async getAll(page :number, limit:number,type?:CommunityType): Promise<PaginatedListDto<CommunityDto>> {
    const items = await this.communityRepo.findAll(page, limit,type);
    return new PaginatedListDto(items.communities, items.total, page, limit);
  }

  async getById(id: number): Promise<CommunityDto | null> {
    return this.communityRepo.findById(id);
  }

  async getByOwnerId(userId: number,page:number,limit:number):  Promise<PaginatedListDto<CommunityDto>> {
    const items = await this.communityRepo.findAll(page, limit);
    return new PaginatedListDto(items.communities, items.total, page, limit);
    }

  async create(dto: CreateCommunityDto): Promise<CommunityDto | null> {
    const created = await this.communityRepo.create(dto);
    if (created.id === 0) return null;
    return this.toDto(created);
  }

  async update(id: number, fields: Partial<CommunityDto>): Promise<boolean> {
    return this.communityRepo.update(id, fields);
  }

  async delete(id: number): Promise<boolean> {
    return this.communityRepo.delete(id);
  }
}
