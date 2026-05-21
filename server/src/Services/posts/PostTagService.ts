import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { PostMessages } from "../../Domain/constants/messages/posts/PostMessages";
import { TagMessages } from "../../Domain/constants/messages/tags/TagMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { CommunityMemberRole } from "../../Domain/enums/communities/CommunityMemberRole";
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { IPostRepository } from "../../Domain/repositories/posts/IPostRepository";
import { IPostTagRepository } from "../../Domain/repositories/posts/IPostTagRepository";
import { ITagRepository } from "../../Domain/repositories/tags/ITagRepository";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { IPostTagService } from "../../Domain/services/posts/IPostTagService";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";


  export class PostTagService implements IPostTagService {
    public constructor(
      private readonly postRepo: IPostRepository,
      private readonly communityMemberRepo: ICommunityMemberRepository,
      private readonly tagRepo: ITagRepository,
      private readonly postTagRepo: IPostTagRepository,
      private readonly auditHelperService: IAuditHelperService
    ) {}

    private async canManagePostTags(postAuthorId: number, communityId: number, requesterId: number, requesterRole?: UserRole): Promise<boolean> {
    const isAuthor = postAuthorId === requesterId;
    const isAdmin = requesterRole === UserRole.ADMIN;

    if (isAdmin) {
      return true;
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(
      requesterId,
      communityId
    );

    if (
      membership.id !== 0 &&
      (
        membership.status === CommunityMemberStatus.BANNED ||
        membership.status === CommunityMemberStatus.PENDING
      )
    ) {
      return false;
    }

    const isModerator =
      membership.id !== 0 &&
      membership.role === CommunityMemberRole.MODERATOR &&
      membership.status === CommunityMemberStatus.ACTIVE;

    return isAuthor || isModerator;
  }

  async addTag(postId: number, tagId: number, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult> {
    const post = await this.postRepo.findById(postId);
    if(post.id === 0){
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const tag = await this.tagRepo.findById(tagId);
    if(tag.id === 0){
      return ServiceResultFactory.fail(TagMessages.notFound, HttpStatus.notFound);
    }
  
    const canManage = await this.canManagePostTags(post.authorId, post.communityId, ctx.userId, requesterRole);
    if (!canManage) {
      return ServiceResultFactory.fail(PostMessages.onlyAuthorOrModeratorCanAddTag, HttpStatus.forbidden);
    }

    const alreadyExists = await this.postTagRepo.exists(postId, tagId);
    if(alreadyExists){
      return ServiceResultFactory.fail(PostMessages.tagAlreadyAdded, HttpStatus.conflict);
    }

    const created = await this.postTagRepo.create(postId, tagId);
    if (created.id === 0) {
      return ServiceResultFactory.fail(PostMessages.addTagFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(new CreateAuditDto(ctx.userId, AuditActions.POST_TAG_ADDED, AuditDetails.POST_TAG_ADDED, ctx.ipAddress));

    return ServiceResultFactory.ok(PostMessages.tagAdded, undefined, HttpStatus.created);
  }


  async removeTag(postId: number, tagId: number, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult> {
    const post = await this.postRepo.findById(postId);
    if(post.id === 0){
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const tag = await this.tagRepo.findById(tagId);
    if(tag.id === 0){
      return ServiceResultFactory.fail(TagMessages.notFound, HttpStatus.notFound);
    }
  
    const canManage = await this.canManagePostTags(post.authorId, post.communityId, ctx.userId, requesterRole);
    if (!canManage) {
      return ServiceResultFactory.fail(PostMessages.onlyAuthorOrModeratorCanRemoveTag, HttpStatus.forbidden);
    }

    const exists = await this.postTagRepo.exists(postId, tagId);
    if(!exists){
      return ServiceResultFactory.fail(PostMessages.tagNotAdded, HttpStatus.notFound);
    }

    const deleted = await this.postTagRepo.delete(postId, tagId);
    if (!deleted) {
      return ServiceResultFactory.fail(PostMessages.removeTagFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(new CreateAuditDto(ctx.userId, AuditActions.POST_TAG_REMOVED, AuditDetails.POST_TAG_REMOVED, ctx.ipAddress));

    return ServiceResultFactory.ok(PostMessages.tagRemoved, undefined, HttpStatus.ok);
  }

}
