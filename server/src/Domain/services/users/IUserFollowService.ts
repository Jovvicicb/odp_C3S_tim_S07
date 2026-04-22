import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IUserFollowService {
    follow(targetUserId: number,ctx: AuditContext): Promise<ServiceResult>;
}