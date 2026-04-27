import { TagMessages } from "../../Domain/constants/messages/tags/TagMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateTagDto } from "../../Domain/DTOs/tags/CreateTagDto";
import { TagDto } from "../../Domain/DTOs/tags/TagDto";
import { ITagRepository } from "../../Domain/repositories/tags/ITagRepository";
import { ITagService } from "../../Domain/services/tags/ITagService";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { TagMapper } from "../../Shared/mappers/tags/TagMapper";

export class TagService implements ITagService {
  public constructor(
    private readonly tagRepo: ITagRepository
  ) {}


  async create(dto: CreateTagDto): Promise<ServiceResult<TagDto>> {
    const existing = await this.tagRepo.findByName(dto.name);
    if(existing.id !== 0){
        return ServiceResultFactory.fail<TagDto>(TagMessages.nameTaken, HttpStatus.conflict);
    }

    const created = await this.tagRepo.create(dto);
    if (created.id === 0) {
    return ServiceResultFactory.fail<TagDto>(TagMessages.createFailed, HttpStatus.internalServerError);
    }

    return ServiceResultFactory.ok(TagMessages.created, TagMapper.toDto(created), HttpStatus.created);
  }
 
}
