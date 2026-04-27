import { CreateTagDto } from "../../DTOs/tags/CreateTagDto";
import { TagDto } from "../../DTOs/tags/TagDto";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface ITagService {
  create(dto: CreateTagDto): Promise<ServiceResult<TagDto>>;
}