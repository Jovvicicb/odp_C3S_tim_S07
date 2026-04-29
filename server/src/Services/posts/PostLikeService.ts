import { CommunityMessages } from "../../Domain/constants/messages/community/CommunityMessages";
import { PostMessages } from "../../Domain/constants/messages/posts/PostMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { CommunityType } from "../../Domain/enums/communities/CommunityType";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { IPostLikeRepository } from "../../Domain/repositories/posts/IPostLikeRepository";
import { IPostRepository } from "../../Domain/repositories/posts/IPostRepository";
import { IPostLikeService } from "../../Domain/services/posts/IPostLikeService";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";

export class PostLikeService implements IPostLikeService {
  public constructor(
    private readonly postRepo: IPostRepository,
    private readonly postLikeRepo: IPostLikeRepository,
    private readonly communityRepo: ICommunityRepository,
    private readonly communityMemberRepo: ICommunityMemberRepository,
  ) {}

  async like(userId: number, postId: number): Promise<ServiceResult> {
    const post = await this.postRepo.findById(postId);
    if(post.id === 0){
        return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const community = await this.communityRepo.findById(post.communityId);
    if(community.id === 0){
        return ServiceResultFactory.fail(CommunityMessages.notFound, HttpStatus.notFound);
    }
  
    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(userId, post.communityId);
    if (membership.status === CommunityMemberStatus.BANNED) {
        return ServiceResultFactory.fail(PostMessages.cannotLikePost, HttpStatus.forbidden);
    }

    if (membership.status === CommunityMemberStatus.PENDING) {
        return ServiceResultFactory.fail(PostMessages.cannotLikePost, HttpStatus.forbidden);
    }

    if (community.type === CommunityType.PRIVATE && ( membership.id === 0 || membership.status !== CommunityMemberStatus.ACTIVE )){
        return ServiceResultFactory.fail(PostMessages.cannotLikePost, HttpStatus.forbidden);
    }

    const alreadyLiked = await this.postLikeRepo.exists(userId,postId)
    if(alreadyLiked){
      return ServiceResultFactory.fail(PostMessages.alreadyLiked, HttpStatus.conflict);
    }

    const created = await this.postLikeRepo.create(userId,postId);
    if (created.id === 0) {
        return ServiceResultFactory.fail(PostMessages.likeFailed, HttpStatus.internalServerError);
    }

    return ServiceResultFactory.ok(PostMessages.liked, undefined, HttpStatus.ok);
  }


  async unlike(userId: number, postId: number): Promise<ServiceResult> {
    const post = await this.postRepo.findById(postId);
    if(post.id === 0){
        return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const exists = await this.postLikeRepo.exists(userId,postId)
    if(!exists){
        return ServiceResultFactory.fail(PostMessages.notLiked, HttpStatus.notFound);
    }

    const deleted = await this.postLikeRepo.delete(userId,postId);
    if (!deleted) {
        return ServiceResultFactory.fail(PostMessages.unlikeFailed, HttpStatus.internalServerError);
    }

    return ServiceResultFactory.ok(PostMessages.unliked, undefined, HttpStatus.ok);
  }

}
