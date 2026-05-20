import { AuditActions } from '../../Domain/constants/messages/audits/AuditActions';
import { AuditDetails } from '../../Domain/constants/messages/audits/AuditDetails';
import { CommunityMessages } from '../../Domain/constants/messages/community/CommunityMessages';
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateAuditDto } from '../../Domain/DTOs/audits/CreateAuditDto';
import { PaginatedListDto } from '../../Domain/DTOs/common/PaginatedListDto';
import { CommunityDto } from '../../Domain/DTOs/community/CommunityDto';
import { CommunityMemberRole } from '../../Domain/enums/communities/CommunityMemberRole';
import { CommunityMemberStatusAction } from '../../Domain/enums/communities/CommunityMemberStatusAction';
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
import { CommunityMember } from '../../Domain/models/CommunityMember';
import { UserRole } from '../../Domain/enums/users/UserRole';
import { CommunityMemberDetailsDto } from '../../Domain/DTOs/community/CommunityMemberDetailsDto';
import { IUserRepository } from '../../Domain/repositories/users/IUserRepository';
import { IUserFollowRepository } from '../../Domain/repositories/users/IUserFollowRepository';
import { User } from '../../Domain/models/User';
import { UserFollowStatus } from '../../Domain/enums/users/UserFollowStatus';
import { UserMapper } from '../../Shared/mappers/users/UserMapper';

export class CommunityMemberService implements ICommunityMemberService {
  public constructor(
    private readonly communityMemberRepo: ICommunityMemberRepository,
    private readonly communityRepo: ICommunityRepository,
    private readonly userRepo: IUserRepository,
    private readonly userFollowRepo: IUserFollowRepository,
    private readonly auditHelperService: IAuditHelperService
  ) {}


  private isActiveModerator(membership: CommunityMember): boolean {
    return (
        membership.id !== 0 &&
        membership.role === CommunityMemberRole.MODERATOR &&
        membership.status === CommunityMemberStatus.ACTIVE
    );
  }
    

  async join(communityId: number, userId: number): Promise<ServiceResult> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0){
        return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    } 

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(userId, communityId);
    if (membership.id !== 0) {
        if (membership.status === CommunityMemberStatus.ACTIVE) {
            return ServiceResultFactory.fail(CommunityMessages.alreadyMember, HttpStatus.conflict);
        }

        if (membership.status === CommunityMemberStatus.PENDING) {
            return ServiceResultFactory.fail(CommunityMessages.requestAlreadySent, HttpStatus.conflict);
        }

        if (membership.status === CommunityMemberStatus.BANNED) {
            return ServiceResultFactory.fail(CommunityMessages.bannedFromCommunity, HttpStatus.forbidden);
        }
    }
    
    const status = community.type === CommunityType.PUBLIC
        ? CommunityMemberStatus.ACTIVE
        : CommunityMemberStatus.PENDING;

    const created = await this.communityMemberRepo.create(userId, communityId, CommunityMemberRole.MEMBER, status);
    if (!created) {
        return ServiceResultFactory.fail(CommunityMessages.joinFailed, HttpStatus.internalServerError);
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
        return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    } 

    if (community.ownerId === userId){
        return ServiceResultFactory.fail(CommunityMessages.ownerCannotLeave, HttpStatus.badRequest);
    } 

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(userId, communityId);
    if (membership.id === 0) {
        return ServiceResultFactory.fail(CommunityMessages.notMember, HttpStatus.notFound);
    }

    if (membership.status === CommunityMemberStatus.BANNED) {
        return ServiceResultFactory.fail(CommunityMessages.notMember, HttpStatus.notFound);
    }
    
    const deleted = await this.communityMemberRepo.delete(userId, communityId);
    if (!deleted) {
        return ServiceResultFactory.fail(CommunityMessages.leaveFailed, HttpStatus.internalServerError);
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

    if (result.communityIds.length === 0) {
        const data = new PaginatedListDto([], result.total, page, limit);

        return ServiceResultFactory.ok(
        CommunityMessages.fetchMineSuccess,
        data,
        HttpStatus.ok
        );
    }

    const communities =await this.communityRepo.findByIds(result.communityIds);

    const communitiesById = communities.reduce<Record<number, CommunityDto>>((acc, community) => {
        acc[community.id] = CommunityMapper.toDto(community);
        return acc;
    }, {});

    const communitiesDto = result.communityIds
    .map((id) => communitiesById[id])
    .filter((community): community is CommunityDto => community !== undefined);

    const data = new PaginatedListDto(
        communitiesDto,
        result.total,
        page,
        limit
    );

    return ServiceResultFactory.ok(CommunityMessages.fetchMineSuccess, data, HttpStatus.ok);
  }

  async updateMemberRole(communityId: number, targetUserId: number, role: CommunityMemberRole, ctx: AuditContext): Promise<ServiceResult> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0){
        return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    } 

    const requesterId = ctx.userId;
    const requesterMembership = await this.communityMemberRepo.findByUserIdAndCommunityId(requesterId, communityId);
   if (!this.isActiveModerator(requesterMembership)) {
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

    const updated = await this.communityMemberRepo.updateRole(targetUserId,communityId,role);
    if(!updated ){
        return ServiceResultFactory.fail(CommunityMessages.updateMemberRoleFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate( new CreateAuditDto(
        requesterId, AuditActions.COMMUNITY_MEMBER_ROLE_UPDATED, AuditDetails.COMMUNITY_MEMBER_ROLE_UPDATED, ctx.ipAddress)
    );

    return ServiceResultFactory.ok(CommunityMessages.memberRoleUpdated, undefined, HttpStatus.ok);
  }

  async updateMemberStatus(communityId: number, targetUserId: number, action: CommunityMemberStatusAction, ctx: AuditContext): Promise<ServiceResult> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0){
        return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    } 

    const requesterId = ctx.userId;
    if(requesterId === targetUserId){
        return ServiceResultFactory.fail(CommunityMessages.cannotChangeOwnMemberStatus, HttpStatus.badRequest);
    }
    const requesterMembership = await this.communityMemberRepo.findByUserIdAndCommunityId(requesterId, communityId);
    if (!this.isActiveModerator(requesterMembership)) {
        return ServiceResultFactory.fail(CommunityMessages.onlyModeratorCanChangeMemberStatus, HttpStatus.forbidden);
    }

    const targetMembership = await this.communityMemberRepo.findByUserIdAndCommunityId(targetUserId, communityId);
    if(targetMembership.id === 0){
        return ServiceResultFactory.fail(CommunityMessages.memberNotFound, HttpStatus.notFound);
    }

    if(targetMembership.status !== CommunityMemberStatus.PENDING){
        return ServiceResultFactory.fail(CommunityMessages.onlyPendingRequestCanBeProcessed, HttpStatus.conflict);
    }

    if(action === CommunityMemberStatusAction.ACCEPT){
        const updated  = await this.communityMemberRepo.updateStatus(targetUserId, communityId, CommunityMemberStatus.ACTIVE);
        if(!updated){
            return ServiceResultFactory.fail(CommunityMessages.updateMemberStatusFailed, HttpStatus.internalServerError);
        }

        await this.auditHelperService.safeCreate( new CreateAuditDto(
            requesterId, AuditActions.COMMUNITY_JOIN_REQUEST_ACCEPTED, AuditDetails.COMMUNITY_JOIN_REQUEST_ACCEPTED, ctx.ipAddress)
        );

        return ServiceResultFactory.ok(CommunityMessages.joinRequestAccepted, undefined, HttpStatus.ok);
    }

    const deleted = await this.communityMemberRepo.delete(targetUserId, communityId);
    if(!deleted){
        return ServiceResultFactory.fail(CommunityMessages.joinRequestRemovalFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate( new CreateAuditDto(
        requesterId, AuditActions.COMMUNITY_JOIN_REQUEST_DENIED, AuditDetails.COMMUNITY_JOIN_REQUEST_DENIED, ctx.ipAddress)
    );
    
    return ServiceResultFactory.ok(CommunityMessages.joinRequestDenied, undefined, HttpStatus.ok);
  }

  async removeMember(communityId: number, targetUserId: number, ctx: AuditContext): Promise<ServiceResult> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0){
        return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    } 

    const requesterId = ctx.userId;
    const requesterMembership = await this.communityMemberRepo.findByUserIdAndCommunityId(requesterId, communityId);
    if (!this.isActiveModerator(requesterMembership)) {
        return ServiceResultFactory.fail(CommunityMessages.onlyModeratorCanRemoveMember, HttpStatus.forbidden);
    }

    const targetMembership = await this.communityMemberRepo.findByUserIdAndCommunityId(targetUserId, communityId);
    if(targetMembership.id === 0){
        return ServiceResultFactory.fail(CommunityMessages.memberNotFound, HttpStatus.notFound);
    }

    if (community.ownerId === targetUserId) {
        return ServiceResultFactory.fail(CommunityMessages.ownerCannotBeRemoved, HttpStatus.badRequest);
    }


    if (requesterId === targetUserId) {
        return ServiceResultFactory.fail(CommunityMessages.cannotRemoveYourself, HttpStatus.badRequest);
    }

    const deleted = await this.communityMemberRepo.delete(targetUserId, communityId);
    if(!deleted){
        return ServiceResultFactory.fail(CommunityMessages.removeMemberFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate( new CreateAuditDto(
        requesterId, AuditActions.COMMUNITY_MEMBER_REMOVED, AuditDetails.COMMUNITY_MEMBER_REMOVED, ctx.ipAddress)
    );
    
    return ServiceResultFactory.ok(CommunityMessages.memberRemoved, undefined, HttpStatus.ok);
  }

  
  async getJoinRequests(communityId: number, page: number, limit: number, viewerId: number, viewerRole: UserRole): Promise<ServiceResult<PaginatedListDto<CommunityMemberDetailsDto>>> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0) {
      return ServiceResultFactory.fail<PaginatedListDto<CommunityMemberDetailsDto>>(CommunityMessages.notFound, HttpStatus.notFound);
    }

    const isAdmin = viewerRole === UserRole.ADMIN;

    const requesterMembership =
      await this.communityMemberRepo.findByUserIdAndCommunityId(
        viewerId,
        communityId
      );

    if (!isAdmin && !this.isActiveModerator(requesterMembership)) {
      return ServiceResultFactory.fail<PaginatedListDto<CommunityMemberDetailsDto>>(
        CommunityMessages.onlyModeratorCanViewJoinRequests,
        HttpStatus.forbidden
      );
    }

    const result = await this.communityMemberRepo.findPendingMembersByCommunityId(page, limit, communityId);

    if (result.members.length === 0) {
      const data = new PaginatedListDto<CommunityMemberDetailsDto>(
        [],
        result.total,
        page,
        limit
      );

      return ServiceResultFactory.ok(CommunityMessages.joinRequestsFetched, data, HttpStatus.ok);
    }

    const userIds = result.members.map((member) => member.userId);

    const users = await this.userRepo.findByIds(userIds);

    const followedUserIds = await this.userFollowRepo.findFollowingIdsFromList(viewerId, userIds);

    const followedUserIdsSet = new Set(followedUserIds);

    const usersById = users.reduce<Record<number, User>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const items = result.members
      .map((member) => {
        const user = usersById[member.userId];

        if (!user) {
          return undefined;
        }

        const followStatus =
          user.id === viewerId
            ? UserFollowStatus.SELF
            : followedUserIdsSet.has(user.id)
              ? UserFollowStatus.FOLLOWING
              : UserFollowStatus.NOT_FOLLOWING;

        return new CommunityMemberDetailsDto(
          UserMapper.toDto(user, followStatus),
          member.role,
          member.status,
          community.ownerId === user.id
        );
      })
      .filter(
        (item): item is CommunityMemberDetailsDto => item !== undefined
      );

    const data = new PaginatedListDto(items, result.total, page, limit);

    return ServiceResultFactory.ok(CommunityMessages.joinRequestsFetched, data, HttpStatus.ok);
  }

}
