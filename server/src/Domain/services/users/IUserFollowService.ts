import { PaginatedListDto } from "../../DTOs/common/PaginatedListDto";
import { GetFollowersDto } from "../../DTOs/users/GetFollowersDto";
import { UserDto } from "../../DTOs/users/UserDto";
import { AuditContext } from "../../types/audits/AuditContext";
import { ServiceResult } from "../../types/service/ServiceResult";

export interface IUserFollowService {
    follow(targetUserId: number,ctx: AuditContext): Promise<ServiceResult>;
    unfollow(targetUserId: number,ctx: AuditContext): Promise<ServiceResult>;
    getFollowers(dto: GetFollowersDto): Promise<ServiceResult<PaginatedListDto<UserDto>>>;
}