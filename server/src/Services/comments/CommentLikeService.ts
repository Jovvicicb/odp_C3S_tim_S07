import { CommentMessages } from "../../Domain/constants/messages/comments/CommentMessages";
import { CommunityMessages } from "../../Domain/constants/messages/community/CommunityMessages";
import { PostMessages } from "../../Domain/constants/messages/posts/PostMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { CommunityType } from "../../Domain/enums/communities/CommunityType";
import { ICommentLikeRepository } from "../../Domain/repositories/comments/ICommentLikeRepository";
import { ICommentRepository } from "../../Domain/repositories/comments/ICommentRepository";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { IPostRepository } from "../../Domain/repositories/posts/IPostRepository";
import { ICommentLikeService } from "../../Domain/services/comments/ICommentLikeService";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";

export class CommentLikeService implements ICommentLikeService {
  public constructor(
    private readonly commentRepo: ICommentRepository,
    private readonly commentLikeRepo: ICommentLikeRepository,
    private readonly postRepo: IPostRepository,
    private readonly communityRepo: ICommunityRepository,
    private readonly communityMemberRepo: ICommunityMemberRepository
  ) {}

   private async checkCommentLikeAccess(userId: number, commentId: number, forbiddenMessage: string): Promise<ServiceResult> {
    const comment = await this.commentRepo.findById(commentId);
    if (comment.id === 0) {
      return ServiceResultFactory.fail(CommentMessages.notFound, HttpStatus.notFound);
    }

    if (comment.isDeleted) {
      return ServiceResultFactory.fail(CommentMessages.cannotLikeDeletedComment, HttpStatus.conflict);
    }

    const post = await this.postRepo.findById(comment.postId);
    if (post.id === 0) {
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const community = await this.communityRepo.findById(post.communityId);
    if (community.id === 0) {
      return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(userId, post.communityId);
    if (
      membership.id !== 0 &&
      (
        membership.status === CommunityMemberStatus.BANNED ||
        membership.status === CommunityMemberStatus.PENDING
      )
    ) {
      return ServiceResultFactory.fail(forbiddenMessage, HttpStatus.forbidden);
    }

    if (
      community.type === CommunityType.PRIVATE &&
      (
        membership.id === 0 ||
        membership.status !== CommunityMemberStatus.ACTIVE
      )
    ) {
      return ServiceResultFactory.fail(forbiddenMessage,  HttpStatus.forbidden);
    }

    return ServiceResultFactory.ok(CommentMessages.accessAllowed, undefined, HttpStatus.ok);
  }

  async like(userId: number, commentId: number): Promise<ServiceResult> {
    const accessResult = await this.checkCommentLikeAccess(userId, commentId,  CommentMessages.cannotLikeComment);
    if (!accessResult.success) {
      return ServiceResultFactory.fail(accessResult.message ?? CommentMessages.cannotLikeComment, accessResult.status ?? HttpStatus.forbidden);
    }

    const alreadyLiked = await this.commentLikeRepo.exists(userId, commentId);
    if (alreadyLiked) {
        return ServiceResultFactory.fail(CommentMessages.alreadyLiked, HttpStatus.conflict);
    }

    const created = await this.commentLikeRepo.create(userId, commentId);
    if (created.id === 0) {
        return ServiceResultFactory.fail(CommentMessages.likeFailed, HttpStatus.internalServerError );
    }

    return ServiceResultFactory.ok(CommentMessages.liked, undefined, HttpStatus.ok);
  }

  async unlike(userId: number, commentId: number): Promise<ServiceResult> {
    const accessResult = await this.checkCommentLikeAccess(userId, commentId,  CommentMessages.cannotUnlikeComment);
    if (!accessResult.success) {
      return ServiceResultFactory.fail(accessResult.message ?? CommentMessages.cannotUnlikeComment, accessResult.status ?? HttpStatus.forbidden);
    }

    const exists = await this.commentLikeRepo.exists(userId, commentId);
    if (!exists) {
        return ServiceResultFactory.fail(CommentMessages.notLiked, HttpStatus.notFound);
    }

    const deleted = await this.commentLikeRepo.delete(userId, commentId);
    if (!deleted) {
        return ServiceResultFactory.fail(CommentMessages.unlikeFailed, HttpStatus.internalServerError);
    }

    return ServiceResultFactory.ok(CommentMessages.unliked, undefined, HttpStatus.ok);
  }
    
}