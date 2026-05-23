import { ICommunityService } from "../../Domain/services/community/ICommunityService";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { CommunityDto } from "../../Domain/DTOs/community/CommunityDto";
import { CreateCommunityDto } from "../../Domain/DTOs/community/CreateCommunityDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { CommunityMapper } from "../../Shared/mappers/community/CommunityMapper";
import { UpdateCommunityDto } from "../../Domain/DTOs/community/UpdateCommunityDto";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { CommunityMessages } from "../../Domain/constants/messages/community/CommunityMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { CommunityType } from "../../Domain/enums/communities/CommunityType";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { CommunityMemberRole } from "../../Domain/enums/communities/CommunityMemberRole";
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { CreateCommunityResponseDto } from "../../Domain/DTOs/community/CreateCommunityResponseDto";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { CommunityDetailsDto } from "../../Domain/DTOs/community/CommunityDetailsDto";
import { UserMapper } from "../../Shared/mappers/users/UserMapper";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { CommunityMember } from "../../Domain/models/CommunityMember";
import { DiscoverCommunitiesDto } from "../../Domain/DTOs/community/DiscoverCommunitiesDto";
import { UserFollowStatus } from "../../Domain/enums/users/UserFollowStatus";
import { User } from "../../Domain/models/User";
import { IUserFollowRepository } from "../../Domain/repositories/users/IUserFollowRepository";
import { CommunityViewerPermissionsDto } from "../../Domain/DTOs/community/CommunityViewerPermissionsDto";
import { CommunityMemberDetailsDto } from "../../Domain/DTOs/community/CommunityMemberDetailsDto";
import { Community } from "../../Domain/models/Community";

export class CommunityService implements ICommunityService {
  public constructor(
     private readonly communityRepo: ICommunityRepository,
     private readonly communityMemberRepo: ICommunityMemberRepository,
     private readonly userRepo: IUserRepository,
     private readonly userFollowRepo: IUserFollowRepository,
     private readonly auditHelperService: IAuditHelperService
  ) {}


  private async buildOwnerUsernamesById(communities: Community[]): Promise<Record<number, string>> {
    const ownerIds = Array.from(new Set(communities.map((community) => community.ownerId)));

    if (ownerIds.length === 0) {
      return {};
    }

    const owners = await this.userRepo.findByIds(ownerIds);

    return owners.reduce<Record<number, string>>((acc, owner) => {
      acc[owner.id] = owner.username;
      return acc;
    }, {});
  }

  private isActiveModerator(membership: CommunityMember): boolean {
    return (
      membership.id !== 0 &&
      membership.role === CommunityMemberRole.MODERATOR &&
      membership.status === CommunityMemberStatus.ACTIVE
    );
  }

  private buildViewerPermissions(isOwner: boolean, isModerator: boolean, canViewContent: boolean, membershipStatus: CommunityMemberStatus | null): CommunityViewerPermissionsDto {
    const canCreatePost =
      canViewContent && membershipStatus === CommunityMemberStatus.ACTIVE;

    return new CommunityViewerPermissionsDto(
      isOwner,
      isModerator,
      isModerator,
      isModerator,
      isModerator,
      isModerator,
      canCreatePost
    );
  }

  async getPublic(page: number, limit: number, viewerId?: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>> {
    const result = await this.communityRepo.findAll(page, limit,CommunityType.PUBLIC);

    const communityIds = result.communities.map((c) => c.id);

    const statusesByCommunityId = viewerId
    ? await this.communityMemberRepo.findStatusesByUserIdAndCommunityIds(viewerId, communityIds)
    : {};

    const ownerUsernamesById = await this.buildOwnerUsernamesById(result.communities);

    const data = new PaginatedListDto(
      result.communities.map((c) =>
          CommunityMapper.toDto(
            c,
            statusesByCommunityId[c.id] ?? null,
            ownerUsernamesById[c.ownerId] ?? null
          )
        ),
      result.total, 
      page, 
      limit
    );

    return ServiceResultFactory.ok(CommunityMessages.fetchPublicSuccess,data,HttpStatus.ok);
  }

  async discover(dto: DiscoverCommunitiesDto, viewerId: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>> {
    const result = await this.communityRepo.discover(dto.page, dto.limit, dto.type, dto.search);

    const communityIds = result.communities.map((c) => c.id);

    const statusesByCommunityId =
      communityIds.length > 0
        ? await this.communityMemberRepo.findStatusesByUserIdAndCommunityIds(viewerId, communityIds)
        : {};

    const ownerUsernamesById = await this.buildOwnerUsernamesById(result.communities);
    
    const data = new PaginatedListDto(
      result.communities.map((c) =>
          CommunityMapper.toDto(
            c,
            statusesByCommunityId[c.id] ?? null,
            ownerUsernamesById[c.ownerId] ?? null
          )
        ),
      result.total,
      dto.page,
      dto.limit
    );

    return ServiceResultFactory.ok(CommunityMessages.discoverSuccess, data, HttpStatus.ok);
  }

  async getAll(page: number, limit: number, viewerId?: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>> {
    const result = await this.communityRepo.findAll(page, limit);

    const communityIds = result.communities.map((c) => c.id);

    const statusesByCommunityId = viewerId
      ? await this.communityMemberRepo.findStatusesByUserIdAndCommunityIds(viewerId, communityIds)
      : {};

    const ownerUsernamesById = await this.buildOwnerUsernamesById(result.communities);
    
    const data = new PaginatedListDto(
      result.communities.map((c) =>
          CommunityMapper.toDto(
            c,
            statusesByCommunityId[c.id] ?? null,
            ownerUsernamesById[c.ownerId] ?? null
          )
        ),
      result.total,
      page, 
      limit
    );

    return ServiceResultFactory.ok(CommunityMessages.fetchAllSuccess, data, HttpStatus.ok);
  }

  async create(dto: CreateCommunityDto,ctx: AuditContext): Promise<ServiceResult<CreateCommunityResponseDto>> {
    const existing = await this.communityRepo.findByName(dto.name);
    if (existing.id !== 0) {
      return ServiceResultFactory.fail<CreateCommunityResponseDto>(CommunityMessages.nameTaken,  HttpStatus.conflict);
    }

    const community = await this.communityRepo.create(dto);
    if (community.id === 0) {
       return ServiceResultFactory.fail<CreateCommunityResponseDto>(CommunityMessages.createFailed, HttpStatus.internalServerError);
    }

    const communityMemberCreated = await this.communityMemberRepo.create(dto.ownerId, community.id, CommunityMemberRole.MODERATOR, CommunityMemberStatus.ACTIVE);
    if (!communityMemberCreated) {
      await this.communityRepo.delete(community.id);
      return ServiceResultFactory.fail<CreateCommunityResponseDto>(CommunityMessages.createFailed, HttpStatus.internalServerError);
    }
    
    const createdDto =  CommunityMapper.toCreateResponseDto(community);

    await this.auditHelperService.safeCreate( new CreateAuditDto(ctx.userId, AuditActions.COMMUNITY_CREATED, AuditDetails.COMMUNITY_CREATED, ctx.ipAddress));

    return ServiceResultFactory.ok(CommunityMessages.created, createdDto, HttpStatus.created);
  }

 async getById(page: number, limit: number, communityId: number, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<CommunityDetailsDto>> {
  const community = await this.communityRepo.findById(communityId);

  if (community.id === 0) {
    return ServiceResultFactory.fail<CommunityDetailsDto>(CommunityMessages.notFound, HttpStatus.notFound);
  }

  const isAdmin = viewerRole === UserRole.ADMIN;

  const viewerMembership = viewerId
    ? await this.communityMemberRepo.findByUserIdAndCommunityId(
        viewerId,
        communityId
      )
    : undefined;

  const membershipStatus =
    viewerMembership && viewerMembership.id !== 0
      ? viewerMembership.status
      : null;

  const ownerUsernamesById = await this.buildOwnerUsernamesById([community]);

  const communityDto = CommunityMapper.toDto(community, membershipStatus, ownerUsernamesById[community.ownerId] ?? null);

  const isOwner = viewerId !== undefined && community.ownerId === viewerId;

  const isActiveModerator =
    viewerMembership !== undefined && this.isActiveModerator(viewerMembership);

  const isModerator = isAdmin || isActiveModerator;

  const canViewContent =
    community.type === CommunityType.PUBLIC ||
    isAdmin ||
    membershipStatus === CommunityMemberStatus.ACTIVE;

  const permissions = this.buildViewerPermissions(
    isOwner,
    isModerator,
    canViewContent,
    membershipStatus
  );

  if (!canViewContent) {
    const data = new CommunityDetailsDto(communityDto, null, false, permissions);

    return ServiceResultFactory.ok(CommunityMessages.fetchOneSuccess, data, HttpStatus.ok
    );
  }

  const membersResult =
    await this.communityMemberRepo.findActiveMembersByCommunityId(page, limit, communityId);

  if (membersResult.members.length === 0) {
    const members = new PaginatedListDto<CommunityMemberDetailsDto>(
      [],
      membersResult.total,
      page,
      limit
    );

    const data = new CommunityDetailsDto(
      communityDto,
      members,
      true,
      permissions
    );

    return ServiceResultFactory.ok(CommunityMessages.fetchOneSuccess, data, HttpStatus.ok);
  }

  const memberUserIds = membersResult.members.map((member) => member.userId);

  const users = await this.userRepo.findByIds(memberUserIds);

  const followedMemberIds = viewerId
    ? await this.userFollowRepo.findFollowingIdsFromList(
        viewerId,
        memberUserIds
      )
    : [];

  const followedMemberIdsSet = new Set(followedMemberIds);

  const usersById = users.reduce<Record<number, User>>((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  const membersDto = membersResult.members
    .map((member) => {
      const user = usersById[member.userId];

      if (!user) {
        return undefined;
      }

      const followStatus =
        !viewerId
          ? null
          : user.id === viewerId
            ? UserFollowStatus.SELF
            : followedMemberIdsSet.has(user.id)
              ? UserFollowStatus.FOLLOWING
              : UserFollowStatus.NOT_FOLLOWING;

      const userDto = UserMapper.toDto(user, followStatus);

      return new CommunityMemberDetailsDto(userDto, member.role, member.status,  community.ownerId === user.id);
    })
    .filter(
      (member): member is CommunityMemberDetailsDto => member !== undefined
    );

  const members = new PaginatedListDto(
    membersDto,
    membersResult.total,
    page,
    limit
  );

  const data = new CommunityDetailsDto(
    communityDto,
    members,
    true,
    permissions
  );

  return ServiceResultFactory.ok(CommunityMessages.fetchOneSuccess, data, HttpStatus.ok);
}
  

  async update(id: number, dto: UpdateCommunityDto,ctx:AuditContext): Promise<ServiceResult> {
    const existing = await this.communityRepo.findById(id);
    if (existing.id === 0) {
      return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(ctx.userId, id);
    if (!this.isActiveModerator(membership)) {
      return ServiceResultFactory.fail(CommunityMessages.onlyModeratorCanUpdate, HttpStatus.forbidden);
    }

    if (dto.name !== undefined) {
      const byName = await this.communityRepo.findByName(dto.name);
      if (byName.id !== 0 && byName.id !== id) {
        return ServiceResultFactory.fail(CommunityMessages.nameTaken, HttpStatus.conflict);
      }
    }
    const isUpdated = await this.communityRepo.update(id, dto);
    if (!isUpdated) {
      return ServiceResultFactory.fail(CommunityMessages.updateFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate( new CreateAuditDto(ctx.userId, AuditActions.COMMUNITY_UPDATED, AuditDetails.COMMUNITY_UPDATED, ctx.ipAddress));
    
    return ServiceResultFactory.ok(CommunityMessages.updated, undefined, HttpStatus.ok);
  }

  async delete(id: number,ctx:AuditContext): Promise<ServiceResult> {
    const existing = await this.communityRepo.findById(id);
    if (existing.id === 0) {
      return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(ctx.userId, id);
    if (!this.isActiveModerator(membership)) {
      return ServiceResultFactory.fail(CommunityMessages.onlyModeratorCanDelete, HttpStatus.forbidden);
    }

    const isDeleted  = await this.communityRepo.delete(id);
    if (!isDeleted) {
      return ServiceResultFactory.fail(CommunityMessages.deleteFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(new CreateAuditDto(ctx.userId, AuditActions.COMMUNITY_DELETED, AuditDetails.COMMUNITY_DELETED, ctx.ipAddress));
    
    return ServiceResultFactory.ok(CommunityMessages.deleted, undefined, HttpStatus.ok); 
  }

}
