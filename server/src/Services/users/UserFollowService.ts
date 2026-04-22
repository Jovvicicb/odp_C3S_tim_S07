import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { UserMessages } from "../../Domain/constants/messages/user/UserMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { IUserFollowRepository } from "../../Domain/repositories/users/IUserFollowRepository";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { IUserFollowService } from "../../Domain/services/users/IUserFollowService";
import { IUserService } from "../../Domain/services/users/IUserService";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";

export class UserFollowService implements IUserFollowService{
    public constructor(
        private readonly userFollowRepo:IUserFollowRepository,
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

}