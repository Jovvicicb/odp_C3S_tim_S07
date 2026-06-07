import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { CommentMessages } from "../../Domain/constants/messages/comments/CommentMessages";
import { CommunityMessages } from "../../Domain/constants/messages/communities/CommunityMessages";
import { PostMessages } from "../../Domain/constants/messages/posts/PostMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { CommentDto } from "../../Domain/DTOs/comments/CommentDto";
import { CommentTreeDto } from "../../Domain/DTOs/comments/CommentTreeDto";
import { CreateCommentDto } from "../../Domain/DTOs/comments/CreateCommentDto";
import { GetCommentsByPostDto } from "../../Domain/DTOs/comments/GetCommentsByPostDto";
import { UpdateCommentDto } from "../../Domain/DTOs/comments/UpdateCommentDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { CommunityMemberRole } from "../../Domain/enums/communities/CommunityMemberRole";
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { CommunityType } from "../../Domain/enums/communities/CommunityType";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { ICommentLikeRepository } from "../../Domain/repositories/comments/ICommentLikeRepository";
import { ICommentRepository } from "../../Domain/repositories/comments/ICommentRepository";
import { ICommunityMemberRepository } from "../../Domain/repositories/communities/ICommunityMemberRepository";
import { ICommunityRepository } from "../../Domain/repositories/communities/ICommunityRepository";
import { IPostRepository } from "../../Domain/repositories/posts/IPostRepository";
import { ICommentService } from "../../Domain/services/comments/ICommentService";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { CommentMapper } from "../../Shared/mappers/comments/CommentMapper";
import { Comment } from "../../Domain/models/Comment";
import { CommentViewerPermissionsDto } from "../../Domain/DTOs/comments/CommentViewerPermissionsDto";
import { Community } from "../../Domain/models/Community";
import { CommunityMember } from "../../Domain/models/CommunityMember";
import { Post } from "../../Domain/models/Post";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { UserProfileCommentDto } from "../../Domain/DTOs/comments/UserProfileCommentDto";
import { GetCommentsByUserDto } from "../../Domain/DTOs/comments/GetCommentsByUserDto";
import { UserMessages } from "../../Domain/constants/messages/users/UserMessages";
import { DbManager } from "../../Database/connection/DbConnectionPool";

type CommentAccessCheckResult =
  | {
      allowed: true;
      post: Post;
      community: Community;
      membership: CommunityMember;
    }
  | {
      allowed: false;
      message: string;
      status: number;
    };

export class CommentService implements ICommentService {
  public constructor(
    private readonly commentRepo: ICommentRepository,
    private readonly postRepo: IPostRepository,
    private readonly communityRepo: ICommunityRepository,
    private readonly communityMemberRepo: ICommunityMemberRepository,
    private readonly commentLikeRepo: ICommentLikeRepository,
    private readonly userRepo: IUserRepository,
    private readonly auditHelperService: IAuditHelperService,
    private readonly db: DbManager,
  ) {}

  private isActiveModeratorMembership(membership?: {id: number; role: CommunityMemberRole; status: CommunityMemberStatus;}): boolean {
    return (
      !!membership &&
      membership.id !== 0 &&
      membership.role === CommunityMemberRole.MODERATOR &&
      membership.status === CommunityMemberStatus.ACTIVE
    );
  }

  private buildCommentPermissions(
    comment: Comment,
    viewerId: number | undefined,
    canViewContent: boolean,
    canModerateComments: boolean
  ): CommentViewerPermissionsDto {
    const isAuthor = viewerId !== undefined && comment.userId === viewerId;
    const isDeleted = comment.isDeleted;

    const canInteract = !!viewerId && canViewContent;

    return new CommentViewerPermissionsDto(
      canInteract && isAuthor && !isDeleted,
      canInteract && !isDeleted && (isAuthor || canModerateComments),
      canInteract && !isDeleted,
      canInteract && !isDeleted && comment.parentId === null,
      canInteract && !isDeleted && canModerateComments
    );
  }

  private async checkCommentAccess(userId: number, postId: number): Promise<CommentAccessCheckResult> {
    const post = await this.postRepo.findById(postId);
    if (post.id === 0) {
      return { allowed: false, message: PostMessages.notFound, status: HttpStatus.notFound,};
    }

    const community = await this.communityRepo.findById(post.communityId);
    if (community.id === 0) {
      return {allowed: false, message: CommunityMessages.notFound, status: HttpStatus.notFound,};
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(userId, post.communityId);
    if (
      membership.id !== 0 &&
      (
        membership.status === CommunityMemberStatus.BANNED ||
        membership.status === CommunityMemberStatus.PENDING
      )
    ) {
      return {allowed: false, message: CommentMessages.notAllowed, status: HttpStatus.forbidden,};
    }

    if (
      community.type === CommunityType.PRIVATE &&
      (
        membership.id === 0 ||
        membership.status !== CommunityMemberStatus.ACTIVE
      )
    ) {
      return {allowed: false, message: CommentMessages.notAllowed, status: HttpStatus.forbidden,};
    }

    return {allowed: true, post, community, membership,};
  }

  private async canDeleteComment(comment: Comment, postId: number, requesterId: number, requesterRole?: UserRole): Promise<boolean> {
    const isAdmin = requesterRole === UserRole.ADMIN;
    if (isAdmin) {
      return true;
    }

    const post = await this.postRepo.findById(postId);
    if (post.id === 0) {
      return false;
    }

    const community = await this.communityRepo.findById(post.communityId);
    if (community.id === 0) {
      return false;
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(requesterId, post.communityId);
    if (
      membership.id !== 0 &&
      (
        membership.status === CommunityMemberStatus.BANNED ||
        membership.status === CommunityMemberStatus.PENDING
      )
    ) {
      return false;
    }

    const isAuthor = comment.userId === requesterId;
    const isModerator = this.isActiveModeratorMembership(membership);

    if (isModerator) {
      return true;
    }

    if (!isAuthor) {
      return false;
    }

    if (
      community.type === CommunityType.PRIVATE &&
      (
        membership.id === 0 ||
        membership.status !== CommunityMemberStatus.ACTIVE
      )
    ) {
      return false;
    }

    return true;
  }

  private async canModerateComment(postId: number, requesterId: number, requesterRole?: UserRole): Promise<boolean> {
    const isAdmin = requesterRole === UserRole.ADMIN;
    if (isAdmin) {
      return true;
    }

    const post = await this.postRepo.findById(postId);
    if (post.id === 0) {
      return false;
    }

    const community = await this.communityRepo.findById(post.communityId);
    if (community.id === 0) {
      return false;
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(requesterId, post.communityId);

    return this.isActiveModeratorMembership(membership);
  }

  private async getVisiblePostIdsForViewer(postIds: number[], viewerId?: number, viewerRole?: UserRole,): Promise<number[]> {
    if (postIds.length === 0) {
      return [];
    }

    const posts = await this.postRepo.findByIds(postIds);

    if (posts.length === 0) {
      return [];
    }

    if (viewerRole === UserRole.ADMIN) {
      return posts.map((post) => post.id);
    }

    const communityIds = Array.from(
      new Set(posts.map((post) => post.communityId)),
    );

    const communities = await this.communityRepo.findByIds(communityIds);

    const communityById = communities.reduce<Record<number, Community>>(
      (acc, community) => {
        acc[community.id] = community;
        return acc;
      },
      {},
    );

    if (!viewerId) {
      return posts
        .filter((post) => {
          const community = communityById[post.communityId];

          return community?.type === CommunityType.PUBLIC;
        })
        .map((post) => post.id);
    }


    const membershipStatuses = await this.communityMemberRepo.findStatusesByUserIdAndCommunityIds(
        viewerId,
        communityIds,
      );

    return posts
      .filter((post) => {
        const community = communityById[post.communityId];

        if (!community) {
          return false;
        }

        const membershipStatus = membershipStatuses[post.communityId] ?? null;

        if (
          membershipStatus === CommunityMemberStatus.BANNED ||
          membershipStatus === CommunityMemberStatus.PENDING
        ) {
          return false;
        }

        if (community.type === CommunityType.PUBLIC) {
          return true;
        }

        return membershipStatus === CommunityMemberStatus.ACTIVE;
      })
      .map((post) => post.id);
  }


  private async buildUserProfileComments(comments: Comment[],): Promise<UserProfileCommentDto[]> {
    if (comments.length === 0) {
      return [];
    }

    const commentIds = comments.map((comment) => comment.id);

    const postIds = Array.from(
      new Set(comments.map((comment) => comment.postId)),
    );

    const userIds = Array.from(
      new Set(comments.map((comment) => comment.userId)),
    );

    const posts =
      postIds.length > 0
        ? await this.postRepo.findByIds(postIds)
        : [];

    const postById = posts.reduce<Record<number, Post>>((acc, post) => {
      acc[post.id] = post;
      return acc;
    }, {});

    const communityIds = Array.from(
      new Set(posts.map((post) => post.communityId)),
    );

    const communities =
      communityIds.length > 0
        ? await this.communityRepo.findByIds(communityIds)
        : [];

    const communityById = communities.reduce<Record<number, Community>>(
      (acc, community) => {
        acc[community.id] = community;
        return acc;
      },
      {},
    );

    const users =
      userIds.length > 0
        ? await this.userRepo.findByIds(userIds)
        : [];

    const usernameByUserId = users.reduce<Record<number, string>>((acc, user) => {
      acc[user.id] = user.username;
      return acc;
    }, {});

    const likeCountsByCommentId =
      await this.commentLikeRepo.countByCommentIds(commentIds);

    return CommentMapper.toUserProfileDtos(
      comments,
      usernameByUserId,
      postById,
      communityById,
      likeCountsByCommentId,
    );
  }

  async getByUser(dto: GetCommentsByUserDto, viewerId?: number, viewerRole?: UserRole,): Promise<ServiceResult<PaginatedListDto<UserProfileCommentDto>>> {
    const user = await this.userRepo.findById(dto.userId);
    if (user.id === 0) {
      return ServiceResultFactory.fail<PaginatedListDto<UserProfileCommentDto>>(UserMessages.notFound, HttpStatus.notFound,);
    }

    const userCommentPostIds = await this.commentRepo.findPostIdsByUserId(dto.userId,);

    if (userCommentPostIds.length === 0) {
      const data = new PaginatedListDto<UserProfileCommentDto>(
        [],
        0,
        dto.page,
        dto.limit,
      );

      return ServiceResultFactory.ok(CommentMessages.userCommentsFetched, data, HttpStatus.ok,);
    }

    const visiblePostIds = await this.getVisiblePostIdsForViewer(
      userCommentPostIds,
      viewerId,
      viewerRole,
    );

    if (visiblePostIds.length === 0) {
      const data = new PaginatedListDto<UserProfileCommentDto>(
        [],
        0,
        dto.page,
        dto.limit,
      );

      return ServiceResultFactory.ok(CommentMessages.userCommentsFetched, data, HttpStatus.ok,);
    }

    const result = await this.commentRepo.findByUserIdAndPostIds(
      dto,
      visiblePostIds,
    );

    if (result.comments.length === 0) {
      const data = new PaginatedListDto<UserProfileCommentDto>(
        [],
        result.total,
        dto.page,
        dto.limit,
      );

      return ServiceResultFactory.ok(CommentMessages.userCommentsFetched, data, HttpStatus.ok,);
    }

    const items = await this.buildUserProfileComments(result.comments);

    const data = new PaginatedListDto<UserProfileCommentDto>(
      items,
      result.total,
      dto.page,
      dto.limit,
    );

    return ServiceResultFactory.ok(CommentMessages.userCommentsFetched, data, HttpStatus.ok,);
  }
          

  async create(dto: CreateCommentDto, ctx: AuditContext): Promise<ServiceResult<CommentDto>> {
    const access = await this.checkCommentAccess(dto.userId, dto.postId);
    if (!access.allowed) {
      return ServiceResultFactory.fail<CommentDto>(access.message, access.status);
    }

    if (dto.parentId !== null) {
      const parentComment = await this.commentRepo.findById(dto.parentId);

      if (parentComment.id === 0) {
        return ServiceResultFactory.fail<CommentDto>(CommentMessages.parentNotFound, HttpStatus.notFound);
      }

      if (parentComment.postId !== dto.postId) {
        return ServiceResultFactory.fail<CommentDto>(CommentMessages.parentPostMismatch, HttpStatus.badRequest);
      }

       if (parentComment.isDeleted) {
        return ServiceResultFactory.fail<CommentDto>(CommentMessages.cannotReplyToDeleted, HttpStatus.conflict);
    }

      if (parentComment.parentId !== null) {
        return ServiceResultFactory.fail<CommentDto>(CommentMessages.maxDepthReached, HttpStatus.badRequest);
      }
    }

    const writeUnavailableMessage = this.db.getWriteUnavailableMessage();
    if (writeUnavailableMessage) {
        return ServiceResultFactory.fail<CommentDto>(writeUnavailableMessage, HttpStatus.serviceUnavailable,);
    }

    const created = await this.commentRepo.create(dto);
    if (created.id === 0) {
      return ServiceResultFactory.fail<CommentDto>(CommentMessages.createFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate( new CreateAuditDto(ctx.userId, AuditActions.COMMENT_CREATED, AuditDetails.COMMENT_CREATED, ctx.ipAddress));
    
    return ServiceResultFactory.ok(CommentMessages.created, CommentMapper.toDto(created), HttpStatus.created);
  }

  async update(id: number, dto: UpdateCommentDto, ctx: AuditContext): Promise<ServiceResult> {
    const comment = await this.commentRepo.findById(id);
    if (comment.id === 0) {
      return ServiceResultFactory.fail(CommentMessages.notFound, HttpStatus.notFound);
    }

    if (comment.userId !== ctx.userId) {
      return ServiceResultFactory.fail(CommentMessages.onlyAuthorCanUpdate, HttpStatus.forbidden);
    }

    if (comment.isDeleted) {
      return ServiceResultFactory.fail(CommentMessages.cannotUpdateDeleted, HttpStatus.conflict);
    }

    const access = await this.checkCommentAccess(ctx.userId, comment.postId);
    if (!access.allowed) {
      return ServiceResultFactory.fail(access.message,  access.status);
    }

    const writeUnavailableMessage = this.db.getWriteUnavailableMessage();
    if (writeUnavailableMessage) {
        return ServiceResultFactory.fail(writeUnavailableMessage, HttpStatus.serviceUnavailable,);
    }

    const updated = await this.commentRepo.update(id, dto);
    if (!updated) {
      return ServiceResultFactory.fail(CommentMessages.updateFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(
      new CreateAuditDto(ctx.userId, AuditActions.COMMENT_UPDATED, AuditDetails.COMMENT_UPDATED, ctx.ipAddress)
    );

    return ServiceResultFactory.ok(
      CommentMessages.updated, undefined, HttpStatus.ok);
  }

  async delete(id: number, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult> {
    const comment = await this.commentRepo.findById(id);
    if (comment.id === 0) {
      return ServiceResultFactory.fail(CommentMessages.notFound, HttpStatus.notFound);
    }

    if (comment.isDeleted) {
      return ServiceResultFactory.fail(CommentMessages.alreadyDeleted, HttpStatus.conflict);
    }

    const post = await this.postRepo.findById(comment.postId);
    if (post.id === 0) {
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const canDelete = await this.canDeleteComment(comment, comment.postId, ctx.userId, requesterRole);
    if (!canDelete) {
      return ServiceResultFactory.fail(CommentMessages.onlyAuthorOrModeratorCanDelete, HttpStatus.forbidden);
    }

    const writeUnavailableMessage = this.db.getWriteUnavailableMessage();
    if (writeUnavailableMessage) {
        return ServiceResultFactory.fail(writeUnavailableMessage, HttpStatus.serviceUnavailable,);
    }

    const deleted = await this.commentRepo.softDelete(id);
    if (!deleted) {
      return ServiceResultFactory.fail(CommentMessages.deleteFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate( new CreateAuditDto(ctx.userId,AuditActions.COMMENT_DELETED, AuditDetails.COMMENT_DELETED,ctx.ipAddress) );

    return ServiceResultFactory.ok(CommentMessages.deleted, undefined, HttpStatus.ok);
  }


  async getByPost(dto: GetCommentsByPostDto, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<PaginatedListDto<CommentTreeDto>>> {
    const post = await this.postRepo.findById(dto.postId);
    if (post.id === 0) {
      return ServiceResultFactory.fail<PaginatedListDto<CommentTreeDto>>( PostMessages.notFound, HttpStatus.notFound);
    }

    const community = await this.communityRepo.findById(post.communityId);
    if (community.id === 0) {
      return ServiceResultFactory.fail<PaginatedListDto<CommentTreeDto>>(CommunityMessages.notFound, HttpStatus.notFound);
    }

    const isAdmin = viewerRole === UserRole.ADMIN;

    const membership = viewerId
      ? await this.communityMemberRepo.findByUserIdAndCommunityId(viewerId, post.communityId)
      : undefined;

    if (
      !isAdmin &&
      membership &&
      membership.id !== 0 &&
      (
        membership.status === CommunityMemberStatus.BANNED ||
        membership.status === CommunityMemberStatus.PENDING
      )
    ) {
      return ServiceResultFactory.fail<PaginatedListDto<CommentTreeDto>>(CommentMessages.commentsAccessForbidden, HttpStatus.forbidden);
    }

    if (community.type === CommunityType.PRIVATE && !isAdmin) {
      if (
        !viewerId ||
        !membership ||
        membership.id === 0 ||
        membership.status !== CommunityMemberStatus.ACTIVE
      ) {
        return ServiceResultFactory.fail<PaginatedListDto<CommentTreeDto>>(CommentMessages.commentsAccessForbidden, HttpStatus.forbidden);
      }
    }

    const canViewContent =
      community.type === CommunityType.PUBLIC ||
      isAdmin ||
      membership?.status === CommunityMemberStatus.ACTIVE;

    const canModerateComments = isAdmin || this.isActiveModeratorMembership(membership);

    const rootResult = await this.commentRepo.findRootByPost(dto);

    if (rootResult.comments.length === 0) {
      const data = new PaginatedListDto<CommentTreeDto>(
        [],
        rootResult.total,
        dto.page,
        dto.limit
      );

      return ServiceResultFactory.ok(CommentMessages.fetched, data, HttpStatus.ok);
    }

    const rootIds = rootResult.comments.map((comment) => comment.id);

    const replies = await this.commentRepo.findRepliesByParentIds(rootIds);

    const allComments = [...rootResult.comments, ...replies];

    const allCommentIds = allComments.map((comment) => comment.id);

    const userIds = Array.from(
      new Set(allComments.map((comment) => comment.userId))
    );

    const users = userIds.length > 0
      ? await this.userRepo.findByIds(userIds)
      : [];

    const usernameByUserId = users.reduce<Record<number, string>>((acc, user) => {
      acc[user.id] = user.username;
      return acc;
    }, {});

    const likeCounts = await this.commentLikeRepo.countByCommentIds(allCommentIds);

    const likedCommentIds = viewerId
      ? await this.commentLikeRepo.findLikedCommentIdsByUserId(
          viewerId,
          allCommentIds
        )
      : [];

    const likedCommentIdsSet = new Set(likedCommentIds);

    const repliesByParentId = replies.reduce<Record<number, CommentTreeDto[]>>(
      (acc, reply) => {
        const replyDto = CommentMapper.toTreeDto(
          reply,
          usernameByUserId[reply.userId] ?? null,
          likeCounts[reply.id] ?? 0,
          likedCommentIdsSet.has(reply.id),
          this.buildCommentPermissions(
            reply,
            viewerId,
            canViewContent,
            canModerateComments
          ),
          []
        );

        const parentId = reply.parentId as number;

        if (!acc[parentId]) {
          acc[parentId] = [];
        }

        acc[parentId].push(replyDto);

        return acc;
      },
      {}
    );

    const items = rootResult.comments.map((root) => {
      return CommentMapper.toTreeDto(
        root,
        usernameByUserId[root.userId] ?? null,
        likeCounts[root.id] ?? 0,
        likedCommentIdsSet.has(root.id),
        this.buildCommentPermissions(
          root,
          viewerId,
          canViewContent,
          canModerateComments
        ),
        repliesByParentId[root.id] ?? []
      );
    });

    const data = new PaginatedListDto(items, rootResult.total, dto.page, dto.limit);

    return ServiceResultFactory.ok(CommentMessages.fetched, data, HttpStatus.ok);
  }

  async flag(id: number, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult> {
    const comment = await this.commentRepo.findById(id);
    if (comment.id === 0) {
      return ServiceResultFactory.fail(CommentMessages.notFound, HttpStatus.notFound);
    }

    if (comment.isDeleted) {
      return ServiceResultFactory.fail(CommentMessages.cannotFlagDeleted, HttpStatus.conflict);
    }

    const post = await this.postRepo.findById(comment.postId);
    if (post.id === 0) {
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const canModerate = await this.canModerateComment(comment.postId, ctx.userId, requesterRole);
    if (!canModerate) {
      return ServiceResultFactory.fail(CommentMessages.onlyModeratorCanFlag, HttpStatus.forbidden);
    }

    if (comment.isFlagged) {
      return ServiceResultFactory.fail(CommentMessages.alreadyFlagged,HttpStatus.conflict);
    }

    const writeUnavailableMessage = this.db.getWriteUnavailableMessage();
    if (writeUnavailableMessage) {
        return ServiceResultFactory.fail(writeUnavailableMessage, HttpStatus.serviceUnavailable,);
    }

    const updated = await this.commentRepo.updateFlagStatus(id, 1);
    if (!updated) {
      return ServiceResultFactory.fail(CommentMessages.flagFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(
      new CreateAuditDto(ctx.userId, AuditActions.COMMENT_FLAGGED, AuditDetails.COMMENT_FLAGGED, ctx.ipAddress)
    );

    return ServiceResultFactory.ok(CommentMessages.flagged, undefined,HttpStatus.ok);
  }

  async unflag(id: number, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult> {
    const comment = await this.commentRepo.findById(id);
    if (comment.id === 0) {
      return ServiceResultFactory.fail(CommentMessages.notFound, HttpStatus.notFound);
    }

    if (comment.isDeleted) {
      return ServiceResultFactory.fail(CommentMessages.cannotUnflagDeleted, HttpStatus.conflict);
    }

    const post = await this.postRepo.findById(comment.postId);
    if (post.id === 0) {
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const canModerate = await this.canModerateComment(comment.postId, ctx.userId, requesterRole);
    if (!canModerate) {
      return ServiceResultFactory.fail(CommentMessages.onlyModeratorCanUnflag, HttpStatus.forbidden);
    }

    if (!comment.isFlagged) {
      return ServiceResultFactory.fail( CommentMessages.notFlagged, HttpStatus.conflict);
    }

    const writeUnavailableMessage = this.db.getWriteUnavailableMessage();
    if (writeUnavailableMessage) {
        return ServiceResultFactory.fail(writeUnavailableMessage, HttpStatus.serviceUnavailable,);
    }

    const updated = await this.commentRepo.updateFlagStatus(id, 0);
    if (!updated) {
      return ServiceResultFactory.fail(CommentMessages.unflagFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(
      new CreateAuditDto(ctx.userId, AuditActions.COMMENT_UNFLAGGED, AuditDetails.COMMENT_UNFLAGGED, ctx.ipAddress)
    );

    return ServiceResultFactory.ok(CommentMessages.unflagged, undefined, HttpStatus.ok);
  }
}