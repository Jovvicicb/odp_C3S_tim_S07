import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IPostTagService {
    addTag(postId: number, tagId: number, ctx: AuditContext): Promise<ServiceResult>;
    removeTag(postId: number, tagId: number, ctx: AuditContext): Promise<ServiceResult>;
}