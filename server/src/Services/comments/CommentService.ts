import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { CommentMessages } from "../../Domain/constants/messages/comments/CommentMessages";
import { CommunityMessages } from "../../Domain/constants/messages/community/CommunityMessages";
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
import { UserRole } from "../../Domain/enums/UserRole";
import { ICommentLikeRepository } from "../../Domain/repositories/comments/ICommentLikeRepository";
import { ICommentRepository } from "../../Domain/repositories/comments/ICommentRepository";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { IPostRepository } from "../../Domain/repositories/posts/IPostRepository";
import { ICommentService } from "../../Domain/services/comments/ICommentService";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { CommentMapper } from "../../Shared/mappers/comments/CommentMapper";

export class CommentService implements ICommentService {
  public constructor(
    private readonly commentRepo: ICommentRepository,
    private readonly postRepo: IPostRepository,
    private readonly communityRepo: ICommunityRepository,
    private readonly communityMemberRepo: ICommunityMemberRepository,
    private readonly commentLikeRepo: ICommentLikeRepository,
    private readonly auditHelperService: IAuditHelperService
  ) {}

  private async isActiveModerator(userId: number, communityId: number): Promise<boolean> {
    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(userId, communityId);
    return (
      membership.id !== 0 &&
      membership.role === CommunityMemberRole.MODERATOR &&
      membership.status === CommunityMemberStatus.ACTIVE
    );
  }

  async create(dto: CreateCommentDto, ctx: AuditContext): Promise<ServiceResult<CommentDto>> {
    const post = await this.postRepo.findById(dto.postId);
    if (post.id === 0) {
      return ServiceResultFactory.fail<CommentDto>(PostMessages.notFound, HttpStatus.notFound);
    }

    const community = await this.communityRepo.findById(post.communityId);
    if (community.id === 0) {
      return ServiceResultFactory.fail<CommentDto>(CommunityMessages.notFound, HttpStatus.notFound);
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(dto.userId, post.communityId);
    if ( membership.id !== 0 &&
       ( membership.status === CommunityMemberStatus.BANNED || membership.status === CommunityMemberStatus.PENDING )
    ) {
      return ServiceResultFactory.fail<CommentDto>(CommentMessages.notAllowed, HttpStatus.forbidden);
    }

    if (community.type === CommunityType.PRIVATE) {
      if (membership.id === 0 || membership.status !== CommunityMemberStatus.ACTIVE) {
        return ServiceResultFactory.fail<CommentDto>(CommentMessages.notAllowed, HttpStatus.forbidden);
      }
    }

    if (dto.parentId !== null) {
      const parentComment = await this.commentRepo.findById(dto.parentId);

      if (parentComment.id === 0) {
        return ServiceResultFactory.fail<CommentDto>(CommentMessages.parentNotFound, HttpStatus.notFound);
      }

      if (parentComment.postId !== dto.postId) {
        return ServiceResultFactory.fail<CommentDto>(CommentMessages.parentPostMismatch, HttpStatus.badRequest);
      }

      if (parentComment.parentId !== null) {
        return ServiceResultFactory.fail<CommentDto>(CommentMessages.maxDepthReached, HttpStatus.badRequest);
      }
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

  async delete(id: number, ctx: AuditContext): Promise<ServiceResult> {
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

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(ctx.userId, post.communityId);

    const isAuthor = comment.userId === ctx.userId;
    const isModerator =
      membership.id !== 0 &&
      membership.role === CommunityMemberRole.MODERATOR &&
      membership.status === CommunityMemberStatus.ACTIVE;

    if (!isAuthor && !isModerator) {
      return ServiceResultFactory.fail(
        CommentMessages.onlyAuthorOrModeratorCanDelete,
        HttpStatus.forbidden
      );
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
      return ServiceResultFactory.fail<PaginatedListDto<CommentTreeDto>>(PostMessages.notFound, HttpStatus.notFound);
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

    const rootResult = await this.commentRepo.findRootByPost(dto);
    const rootIds = rootResult.comments.map((c) => c.id);

    const replies = await this.commentRepo.findRepliesByParentIds(rootIds);

    const allCommentIds = [
      ...rootIds,
      ...replies.map((r) => r.id),
    ];

    const likeCounts = await this.commentLikeRepo.countByCommentIds(allCommentIds);

    const repliesByParentId = replies.reduce<Record<number, CommentTreeDto[]>>((acc, reply) => {
      const replyDto = CommentMapper.toTreeDto(
        reply,
        likeCounts[reply.id] ?? 0,
        []
      );

      return {
        ...acc,
        [reply.parentId as number]: [
          ...(acc[reply.parentId as number] ?? []),
          replyDto,
        ],
      };
    }, {});

    const items = rootResult.comments.map((root) => {
      return CommentMapper.toTreeDto(
        root,
        likeCounts[root.id] ?? 0,
        repliesByParentId[root.id] ?? []
      );
    });

    const data = new PaginatedListDto(
      items,
      rootResult.total,
      dto.page,
      dto.limit
    );

    return ServiceResultFactory.ok(CommentMessages.fetched, data,HttpStatus.ok);
  }


  async flag(id: number, ctx: AuditContext): Promise<ServiceResult> {
    const comment = await this.commentRepo.findById(id);
    if (comment.id === 0) {
      return ServiceResultFactory.fail(CommentMessages.notFound, HttpStatus.notFound);
    }

    const post = await this.postRepo.findById(comment.postId);
    if (post.id === 0) {
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const isModerator = await this.isActiveModerator(ctx.userId, post.communityId);
    if (!isModerator) {
      return ServiceResultFactory.fail(CommentMessages.onlyModeratorCanFlag, HttpStatus.forbidden);
    }

    if (comment.isFlagged) {
      return ServiceResultFactory.fail(CommentMessages.alreadyFlagged,HttpStatus.conflict);
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

  async unflag(id: number, ctx: AuditContext): Promise<ServiceResult> {
    const comment = await this.commentRepo.findById(id);
    if (comment.id === 0) {
      return ServiceResultFactory.fail(CommentMessages.notFound, HttpStatus.notFound);
    }

    const post = await this.postRepo.findById(comment.postId);
    if (post.id === 0) {
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const isModerator = await this.isActiveModerator(ctx.userId, post.communityId);
    if (!isModerator) {
      return ServiceResultFactory.fail( CommentMessages.onlyModeratorCanUnflag, HttpStatus.forbidden);
    }

    if (!comment.isFlagged) {
      return ServiceResultFactory.fail( CommentMessages.notFlagged, HttpStatus.conflict);
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