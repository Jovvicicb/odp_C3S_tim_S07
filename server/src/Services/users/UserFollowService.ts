import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { UserMessages } from "../../Domain/constants/messages/user/UserMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { GetFollowersDto } from "../../Domain/DTOs/users/GetFollowersDto";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { IUserFollowRepository } from "../../Domain/repositories/users/IUserFollowRepository";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { IUserFollowService } from "../../Domain/services/users/IUserFollowService";
import { IUserService } from "../../Domain/services/users/IUserService";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { UserMapper } from "../../Shared/mappers/users/UserMapper";

export class UserFollowService implements IUserFollowService{
    public constructor(
        private readonly userFollowRepo:IUserFollowRepository,
        private readonly userRepo: IUserRepository,
        private readonly userService: IUserService,
        private readonly auditHelperService: IAuditHelperService
    ){}


    async follow(targetUserId: number, ctx: AuditContext): Promise<ServiceResult> {
        const followerId = ctx.userId;

        if(!followerId){
            return ServiceResultFactory.fail(
                UserMessages.unauthorized,
                HttpStatus.unauthorized
            );
        }

        if(followerId === targetUserId){
            return ServiceResultFactory.fail(
                UserMessages.cannotFollowYourself,
                HttpStatus.badRequest
            );
        }

        const targetExists = await this.userService.exists(targetUserId);
        if(!targetExists){
            return ServiceResultFactory.fail(
                UserMessages.notFound,
                HttpStatus.notFound
            );
        }

        const alreadyExists = await this.userFollowRepo.exists(followerId,targetUserId);
        if(alreadyExists){
            return ServiceResultFactory.fail(
                UserMessages.alreadyFollowing,
                HttpStatus.conflict
            );
        }

        const created = await this.userFollowRepo.create(followerId,targetUserId);
        if(created.id === 0){
            return ServiceResultFactory.fail(
                UserMessages.followFailed,
                HttpStatus.internalServerError
            );
        }

        await this.auditHelperService.safeCreate(
            new CreateAuditDto(followerId, AuditActions.USER_FOLLOWED, AuditDetails.USER_FOLLOWED,ctx.ipAddress)
        );

        return ServiceResultFactory.ok(
            UserMessages.followedSuccessfully,
            undefined,
            HttpStatus.ok
        );
    }

    async unfollow(targetUserId: number, ctx: AuditContext): Promise<ServiceResult> {
        const followerId = ctx.userId;

        if(!followerId){
            return ServiceResultFactory.fail(
                UserMessages.unauthorized,
                HttpStatus.unauthorized
            );
        }

        if(followerId === targetUserId){
            return ServiceResultFactory.fail(
                UserMessages.cannotUnFollowYourself,
                HttpStatus.badRequest
            );
        }

        const targetExists = await this.userService.exists(targetUserId);
        if(!targetExists){
            return ServiceResultFactory.fail(
                UserMessages.notFound,
                HttpStatus.notFound
            );
        }

        const exists = await this.userFollowRepo.exists(followerId,targetUserId);
        if(!exists){
            return ServiceResultFactory.fail(
                UserMessages.notFollowing,
                HttpStatus.notFound
            );
        }

        const deleted = await this.userFollowRepo.delete(followerId,targetUserId);
        if(!deleted){
            return ServiceResultFactory.fail(
                UserMessages.unfollowFailed,
                HttpStatus.internalServerError
            );
        }

        await this.auditHelperService.safeCreate(
            new CreateAuditDto(followerId, AuditActions.USER_UNFOLLOWED, AuditDetails.USER_UNFOLLOWED,ctx.ipAddress)
        );

        return ServiceResultFactory.ok(
            UserMessages.unfollowedSuccessfully,
            undefined,
            HttpStatus.ok
        );
    }

    async getFollowers(dto: GetFollowersDto): Promise<ServiceResult<PaginatedListDto<UserDto>>> {
        const userExists = await this.userService.exists(dto.userId)

        if(!userExists){
            return ServiceResultFactory.fail<PaginatedListDto<UserDto>>(
                UserMessages.notFound,
                HttpStatus.notFound
            );
        }

        const result = await this.userFollowRepo.getFollowers(dto);
        const foundUsers = await this.userRepo.findByIds(result.followerIds);
        const users = foundUsers.map((u) => UserMapper.toDto(u));

        const data = new PaginatedListDto(
            users,
            result.total,
            dto.page,
            dto.limit
        );

        return ServiceResultFactory.ok(UserMessages.followersFetchedSuccess, data, HttpStatus.ok);
    }

}