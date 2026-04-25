import { AuditActions } from '../../Domain/constants/messages/audits/AuditActions';
import { AuditDetails } from '../../Domain/constants/messages/audits/AuditDetails';
import { CommunityMessages } from '../../Domain/constants/messages/community/CommunityMessages';
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateAuditDto } from '../../Domain/DTOs/audits/CreateAuditDto';
import { PaginatedListDto } from '../../Domain/DTOs/common/PaginatedListDto';
import { CommunityDto } from '../../Domain/DTOs/community/CommunityDto';
import { CommunityMemberRole } from '../../Domain/enums/communities/CommunityMemberRole';
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { CommunityType } from "../../Domain/enums/communities/CommunityType";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { IAuditHelperService } from '../../Domain/services/common/IAuditHelperService';
import { ICommunityMemberService } from "../../Domain/services/community/ICommunityMemberService";
import { AuditContext } from '../../Domain/types/audits/AuditContext';
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { CommunityMapper } from '../../Shared/mappers/community/CommunityMapper';

export class CommunityMemberService implements ICommunityMemberService {
  public constructor(
     private readonly communityMemberRepo: ICommunityMemberRepository,
     private readonly communityRepo: ICommunityRepository,
     private readonly auditHelperService: IAuditHelperService
  ) {}

  

  async join(communityId: number, userId: number): Promise<ServiceResult> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0){
        return ServiceResultFactory.fail(
            CommunityMessages.notFound,
            HttpStatus.notFound
        );
    } 

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(userId, communityId);

    if (membership.id !== 0) {
        if (membership.status === CommunityMemberStatus.ACTIVE) {
        return ServiceResultFactory.fail(
            CommunityMessages.alreadyMember,
            HttpStatus.conflict
        );
        }

        if (membership.status === CommunityMemberStatus.PENDING) {
        return ServiceResultFactory.fail(
            CommunityMessages.requestAlreadySent,
            HttpStatus.conflict
        );
        }

        if (membership.status === CommunityMemberStatus.BANNED) {
        return ServiceResultFactory.fail(
            CommunityMessages.bannedFromCommunity,
            HttpStatus.forbidden
        );
        }
    }
    
    const status = community.type === CommunityType.PUBLIC
            ? CommunityMemberStatus.ACTIVE
            : CommunityMemberStatus.PENDING;

    const created = await this.communityMemberRepo.create(userId, communityId, CommunityMemberRole.MEMBER, status);
    if (!created) {
        return ServiceResultFactory.fail(
        CommunityMessages.joinFailed,
        HttpStatus.internalServerError
        );
    }
    return ServiceResultFactory.ok(
        status === CommunityMemberStatus.ACTIVE
            ? CommunityMessages.joined
            : CommunityMessages.requestSent,
        undefined,
        HttpStatus.ok
    );
  }

  async leave(communityId: number, userId: number): Promise<ServiceResult> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0){
        return ServiceResultFactory.fail(
            CommunityMessages.notFound,
            HttpStatus.notFound
        );
    } 

    if (community.ownerId === userId){
        return ServiceResultFactory.fail(
            CommunityMessages.ownerCannotLeave,
            HttpStatus.badRequest
        );
    } 

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(userId, communityId);

    if (membership.id === 0) {
        return ServiceResultFactory.fail(
            CommunityMessages.notMember,
            HttpStatus.notFound
        );
    }

    if (membership.status === CommunityMemberStatus.BANNED) {
        return ServiceResultFactory.fail(
            CommunityMessages.notMember,
            HttpStatus.notFound
        );
    }
    
    const deleted = await this.communityMemberRepo.delete(userId, communityId);
    if (!deleted) {
        return ServiceResultFactory.fail(
        CommunityMessages.leaveFailed,
        HttpStatus.internalServerError
        );
    }
    return ServiceResultFactory.ok(
        membership.status === CommunityMemberStatus.PENDING
            ? CommunityMessages.requestCancelled
            : CommunityMessages.left,
        undefined,
        HttpStatus.ok
    );
  }
  
  async getMine(page: number, limit: number, userId: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>> {
    const result = await this.communityMemberRepo.findCommunityIdsByUserId(page,limit,userId);

    const communities =await this.communityRepo.findByIds(result.communityIds);

    const data = new PaginatedListDto(
        communities.map((c) => CommunityMapper.toDto(c)),
        result.total,
        page,
        limit
    );

    return ServiceResultFactory.ok(
        CommunityMessages.fetchMineSuccess,
        data,
        HttpStatus.ok
    );
  }

  async updateMemberRole(communityId: number, targetUserId: number, role: CommunityMemberRole, ctx: AuditContext): Promise<ServiceResult> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0){
        return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    } 

    const requesterId = ctx.userId;
    const userMembership = await this.communityMemberRepo.findByUserIdAndCommunityId(requesterId, communityId);
    if (
        userMembership.id === 0 ||
        userMembership.role !== CommunityMemberRole.MODERATOR ||
        userMembership.status !== CommunityMemberStatus.ACTIVE
    ) {
        return ServiceResultFactory.fail(CommunityMessages.onlyModeratorCanChangeMemberRole, HttpStatus.forbidden);
    }

    const targetMembership = await this.communityMemberRepo.findByUserIdAndCommunityId(targetUserId, communityId);
    if(targetMembership.id === 0){
        return ServiceResultFactory.fail(CommunityMessages.memberNotFound, HttpStatus.notFound);
    }
    if(targetMembership.status !== CommunityMemberStatus.ACTIVE){
        return ServiceResultFactory.fail(CommunityMessages.memberNotActive, HttpStatus.conflict);
    }
    if(community.ownerId === targetUserId){
        return ServiceResultFactory.fail(CommunityMessages.ownerRoleCannotBeChanged, HttpStatus.badRequest);
    }
    if(requesterId === targetUserId){
        return ServiceResultFactory.fail(CommunityMessages.cannotChangeOwnMemberRole, HttpStatus.badRequest);
    }
    if(targetMembership.role === role){
        return ServiceResultFactory.ok(CommunityMessages.memberRoleAlreadySet, undefined, HttpStatus.ok);
    }

    const update =await this.communityMemberRepo.updateRole(targetUserId,communityId,role);
    if(!update){
        return ServiceResultFactory.fail(CommunityMessages.updateMemberRoleFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate( new CreateAuditDto(
        requesterId, AuditActions.COMMUNITY_MEMBER_ROLE_UPDATED, AuditDetails.COMMUNITY_MEMBER_ROLE_UPDATED, ctx.ipAddress)
    );

    return ServiceResultFactory.ok(CommunityMessages.memberRoleUpdated, undefined, HttpStatus.ok);
  }

}
