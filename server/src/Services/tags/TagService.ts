import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { TagMessages } from "../../Domain/constants/messages/tags/TagMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { CreateTagDto } from "../../Domain/DTOs/tags/CreateTagDto";
import { TagDto } from "../../Domain/DTOs/tags/TagDto";
import { ITagRepository } from "../../Domain/repositories/tags/ITagRepository";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { ITagService } from "../../Domain/services/tags/ITagService";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { TagMapper } from "../../Shared/mappers/tags/TagMapper";

export class TagService implements ITagService {
  public constructor(
    private readonly tagRepo: ITagRepository,
    private readonly auditHelperService: IAuditHelperService
  ) {}


  async create(dto: CreateTagDto, ctx: AuditContext): Promise<ServiceResult<TagDto>> {
    const existing = await this.tagRepo.findByName(dto.name);
    if(existing.id !== 0){
        return ServiceResultFactory.fail<TagDto>(TagMessages.nameTaken, HttpStatus.conflict);
    }

    const created = await this.tagRepo.create(dto);
    if (created.id === 0) {
    return ServiceResultFactory.fail<TagDto>(TagMessages.createFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(new CreateAuditDto(ctx.userId, AuditActions.TAG_CREATED, AuditDetails.TAG_CREATED, ctx.ipAddress));

    return ServiceResultFactory.ok(TagMessages.created, TagMapper.toDto(created), HttpStatus.created);
  }

  async delete(id: number, ctx: AuditContext): Promise<ServiceResult> {
    const existing = await this.tagRepo.findById(id);
    if(existing.id === 0){
        return ServiceResultFactory.fail(TagMessages.notFound, HttpStatus.notFound);
    }

    const deleted = await this.tagRepo.delete(id);
    if (!deleted) {
        return ServiceResultFactory.fail(TagMessages.deleteFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(new CreateAuditDto(ctx.userId, AuditActions.TAG_DELETED, AuditDetails.TAG_DELETED, ctx.ipAddress));

    return ServiceResultFactory.ok(TagMessages.deleted, undefined, HttpStatus.ok);
  }

  async getAll(page: number, limit: number): Promise<ServiceResult<PaginatedListDto<TagDto>>> {
    const result  = await this.tagRepo.findAll(page, limit);

    const data = new PaginatedListDto(
        result.tags.map((t) => TagMapper.toDto(t)),
        result.total,
        page,
        limit
    );

    return ServiceResultFactory.ok(TagMessages.fetchAllSuccess, data, HttpStatus.ok);
  }
 
}
