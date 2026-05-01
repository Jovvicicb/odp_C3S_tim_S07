import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { CommentMessages } from "../../Domain/constants/messages/comments/CommentMessages";
import { CommunityMessages } from "../../Domain/constants/messages/community/CommunityMessages";
import { PostMessages } from "../../Domain/constants/messages/posts/PostMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { CommentDto } from "../../Domain/DTOs/comments/CommentDto";
import { CreateCommentDto } from "../../Domain/DTOs/comments/CreateCommentDto";
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { CommunityType } from "../../Domain/enums/communities/CommunityType";
import { ICommentRepository } from "../../Domain/repositories/comments/ICommentRepository";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { IPostRepository } from "../../Domain/repositories/posts/IPostRepository";
import { ICommentService } from "../../Domain/services/comments/ICommentService";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { CommentMapper } from "../../Shared/mappers/comments/CommentMpper";

export class CommentService implements ICommentService {
  public constructor(
    private readonly commentRepo: ICommentRepository,
    private readonly postRepo: IPostRepository,
    private readonly communityRepo: ICommunityRepository,
    private readonly communityMemberRepo: ICommunityMemberRepository,
    private readonly auditHelperService: IAuditHelperService
  ) {}

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
}