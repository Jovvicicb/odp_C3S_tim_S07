import { CreatePostDto } from "../../DTOs/Posts/CreatePostDto";
import { PostDto } from "../../DTOs/Posts/PostDto";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IPostService {
 create(dto: CreatePostDto, ctx:AuditContext): Promise<ServiceResult<PostDto>>;
}