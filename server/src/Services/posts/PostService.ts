import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { CommunityMessages } from "../../Domain/constants/messages/community/CommunityMessages";
import { PostMessages } from "../../Domain/constants/messages/posts/PostMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { CommentTreeDto } from "../../Domain/DTOs/comments/CommentTreeDto";
import { GetCommentsByPostDto } from "../../Domain/DTOs/comments/GetCommentsByPostDto";
import { PaginatedListDto } from "../../Domain/DTOs/common/PaginatedListDto";
import { CreatePostDto } from "../../Domain/DTOs/Posts/CreatePostDto";
import { GetPostsByCommunityDto } from "../../Domain/DTOs/Posts/GetPostsByCommunityDto";
import { PostDetailsDto } from "../../Domain/DTOs/Posts/PostDetailsDto";
import { PostDto } from "../../Domain/DTOs/Posts/PostDto";
import { PostWithDetailsDto } from "../../Domain/DTOs/Posts/PostWithDetailsDto";
import { UpdatePostDto } from "../../Domain/DTOs/Posts/UpdatePostDto";
import { PostTagDto } from "../../Domain/DTOs/tags/PostTagDto";
import { CommentSortType } from "../../Domain/enums/comments/CommentSortType";
import { CommunityMemberRole } from "../../Domain/enums/communities/CommunityMemberRole";
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { CommunityType } from "../../Domain/enums/communities/CommunityType";
import { UserRole } from "../../Domain/enums/UserRole";
import { Post } from "../../Domain/models/Post";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { IPostCommentRepository } from "../../Domain/repositories/posts/IPostCommentRepository";
import { IPostLikeRepository } from "../../Domain/repositories/posts/IPostLikeRepository";
import { IPostRepository } from "../../Domain/repositories/posts/IPostRepository";
import { IPostTagRepository } from "../../Domain/repositories/posts/IPostTagRepository";
import { ITagRepository } from "../../Domain/repositories/tags/ITagRepository";
import { IUserFollowRepository } from "../../Domain/repositories/users/IUserFollowRepository";
import { ICommentService } from "../../Domain/services/comments/ICommentService";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { IPostService } from "../../Domain/services/posts/IPostService";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { PostMapper } from "../../Shared/mappers/posts/PostMapper";


export class PostService implements IPostService {
  public constructor(
    private readonly postRepo: IPostRepository,
    private readonly communityRepo: ICommunityRepository,
    private readonly communityMemberRepo: ICommunityMemberRepository,
    private readonly postTagRepo: IPostTagRepository,
    private readonly postLikeRepo: IPostLikeRepository,
    private readonly tagRepo: ITagRepository,
    private readonly postCommentRepo: IPostCommentRepository,
    private readonly userFollowRepo: IUserFollowRepository,
    private readonly commentService: ICommentService,
    private readonly auditHelperService: IAuditHelperService
  ) {}

  private async buildPostsWithDetails(posts: Post[]): Promise<PostWithDetailsDto[]> {
    const postIds = posts.map((post) => post.id);

    const tagIdsByPostId = await this.postTagRepo.findTagIdsByPostIds(postIds);
    const uniqueTagIds = Array.from(new Set(Object.values(tagIdsByPostId).flat()));
    const tags = await this.tagRepo.findByIds(uniqueTagIds);

    const tagsById = tags.reduce<Record<number, PostTagDto>>((acc, tag) => {
      return {
        ...acc,
        [tag.id]: new PostTagDto(tag.id, tag.name),
      };
    }, {});

    const likeCounts = await this.postLikeRepo.countByPostIds(postIds);
    const commentCounts = await this.postCommentRepo.countByPostIds(postIds);

    return posts.map((post) => {
      const postTags = (tagIdsByPostId[post.id] ?? [])
        .map((tagId) => tagsById[tagId])
        .filter((tag): tag is PostTagDto => tag !== undefined);

      return PostMapper.toWithDetailsDto(
        post,
        postTags,
        likeCounts[post.id] ?? 0,
        commentCounts[post.id] ?? 0
      );
    });
  }

  private async buildPostDetails(post: Post, comments: CommentTreeDto[]): Promise<PostDetailsDto> {
    const tagIdsByPostId = await this.postTagRepo.findTagIdsByPostIds([post.id]);
    const tagIds = tagIdsByPostId[post.id] ?? [];

    const tags = await this.tagRepo.findByIds(tagIds);
    const postTags = tags.map((tag) => new PostTagDto(tag.id, tag.name));

    const likeCounts = await this.postLikeRepo.countByPostIds([post.id]);
    const commentCounts = await this.postCommentRepo.countByPostIds([post.id]);

    return PostMapper.toDetailsDto(
      post,
      postTags,
      likeCounts[post.id] ?? 0,
      commentCounts[post.id] ?? 0,
      comments
    );
  }
  
  async create(dto: CreatePostDto, ctx: AuditContext): Promise<ServiceResult<PostDto>> {
    const community = await this.communityRepo.findById(dto.communityId);
    if (community.id === 0) {
      return ServiceResultFactory.fail<PostDto>(PostMessages.communityNotFound,  HttpStatus.notFound);
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(dto.authorId, dto.communityId);
    if (membership.id === 0 || membership.status !== CommunityMemberStatus.ACTIVE) {
        return ServiceResultFactory.fail<PostDto>(PostMessages.notMember, HttpStatus.forbidden);
    }

    const created = await this.postRepo.create(dto);
    if (created.id === 0) {
      return ServiceResultFactory.fail<PostDto>(PostMessages.createFailed, HttpStatus.internalServerError);
    }
    
    await this.auditHelperService.safeCreate( new CreateAuditDto(ctx.userId, AuditActions.POST_CREATED, AuditDetails.POST_CREATED, ctx.ipAddress));

    const postDto = PostMapper.toDto(created);
    return ServiceResultFactory.ok(PostMessages.created, postDto, HttpStatus.created);
  }

  async update(id: number, dto: UpdatePostDto, ctx: AuditContext): Promise<ServiceResult> {
    const post = await this.postRepo.findById(id);
    if(post.id === 0){
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }
  
    const requesterId = ctx.userId;
    const isAuthor = post.authorId === requesterId;

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(requesterId, post.communityId);
    const isModerator =
        membership.id !== 0 &&
        membership.role === CommunityMemberRole.MODERATOR &&
        membership.status === CommunityMemberStatus.ACTIVE;

    if (!isAuthor && !isModerator) {
      return ServiceResultFactory.fail(PostMessages.onlyAuthorOrModeratorCanUpdate, HttpStatus.forbidden);
    }

    const updated = await this.postRepo.update(id,dto);
    if (!updated) {
      return ServiceResultFactory.fail(PostMessages.updateFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(new CreateAuditDto(ctx.userId, AuditActions.POST_UPDATED, AuditDetails.POST_UPDATED, ctx.ipAddress));

    return ServiceResultFactory.ok(PostMessages.updated, undefined, HttpStatus.ok);
  }


  async delete(id: number, ctx: AuditContext): Promise<ServiceResult> {
    const post = await this.postRepo.findById(id);
    if(post.id === 0){
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const requesterId = ctx.userId;
    const isAuthor = post.authorId === requesterId;

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(requesterId, post.communityId);
    const isModerator =
        membership.id !== 0 &&
        membership.role === CommunityMemberRole.MODERATOR &&
        membership.status === CommunityMemberStatus.ACTIVE;

    if (!isAuthor && !isModerator) {
      return ServiceResultFactory.fail(PostMessages.onlyAuthorOrModeratorCanDelete, HttpStatus.forbidden);
    }

    const deleted = await this.postRepo.delete(id);
    if (!deleted) {
      return ServiceResultFactory.fail(PostMessages.deleteFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(new CreateAuditDto(ctx.userId, AuditActions.POST_DELETED, AuditDetails.POST_DELETED, ctx.ipAddress));

    return ServiceResultFactory.ok(PostMessages.deleted, undefined, HttpStatus.ok);
  }

  async getByCommunity(dto: GetPostsByCommunityDto, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<PaginatedListDto<PostWithDetailsDto>>> {
    const community = await this.communityRepo.findById(dto.communityId);
    if (community.id === 0) {
      return ServiceResultFactory.fail<PaginatedListDto<PostWithDetailsDto>>(CommunityMessages.notFound, HttpStatus.notFound);
    }

    const isAdmin = viewerRole === UserRole.ADMIN;

    const membership = viewerId ? await this.communityMemberRepo.findByUserIdAndCommunityId(viewerId, dto.communityId) : undefined;
    if (!isAdmin && membership && membership.id !== 0 &&
      (
        membership.status === CommunityMemberStatus.BANNED ||
        membership.status === CommunityMemberStatus.PENDING
      )
    ) {
      return ServiceResultFactory.fail<PaginatedListDto<PostWithDetailsDto>>(PostMessages.communityPostsForbidden, HttpStatus.forbidden);
    }

    if (community.type === CommunityType.PRIVATE && !isAdmin) {
      if (!viewerId || !membership || membership.id === 0 || membership.status !== CommunityMemberStatus.ACTIVE) {
        return ServiceResultFactory.fail<PaginatedListDto<PostWithDetailsDto>>(PostMessages.privateCommunityPostsForbidden, HttpStatus.forbidden);
      }
    }

    const result = await this.postRepo.findByCommunity(dto);
   
    const items = await this.buildPostsWithDetails(result.posts);

    const data = new PaginatedListDto(
      items,
      result.total,
      dto.page,
      dto.limit
    );

    return ServiceResultFactory.ok(PostMessages.postsFetched, data, HttpStatus.ok);
  }

  async getFeed(userId: number, page: number, limit: number): Promise<ServiceResult<PaginatedListDto<PostWithDetailsDto>>> {
    const activeCommunityIds = await this.communityMemberRepo.findActiveCommunityIdsByUserId(userId);
    const followingUserIds = await this.userFollowRepo.findFollowingIdsByUserId(userId);
    const publicCommunityIds = await this.communityRepo.findIdsByType(CommunityType.PUBLIC);

    const result = await this.postRepo.findFeed(page, limit, activeCommunityIds, followingUserIds, publicCommunityIds);

    const items = await this.buildPostsWithDetails(result.posts);

    const data = new PaginatedListDto(
      items,
      result.total,
      page,
      limit
    );

    return ServiceResultFactory.ok(PostMessages.feedFetched, data, HttpStatus.ok);
  }

  async getById(id: number, commentsPage: number, commentsLimit: number, commentsSort: CommentSortType, viewerId?: number, viewerRole?: UserRole): Promise<ServiceResult<PostDetailsDto>> {
    const post = await this.postRepo.findById(id);
    if (post.id === 0) {
      return ServiceResultFactory.fail<PostDetailsDto>(PostMessages.notFound, HttpStatus.notFound);
    }

    const community = await this.communityRepo.findById(post.communityId);
    if (community.id === 0) {
      return ServiceResultFactory.fail<PostDetailsDto>(CommunityMessages.notFound, HttpStatus.notFound);
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
      return ServiceResultFactory.fail<PostDetailsDto>(PostMessages.postAccessForbidden, HttpStatus.forbidden);
    }

    if (community.type === CommunityType.PRIVATE && !isAdmin) {
      if (
        !viewerId ||
        !membership ||
        membership.id === 0 ||
        membership.status !== CommunityMemberStatus.ACTIVE
      ) {
        return ServiceResultFactory.fail<PostDetailsDto>(PostMessages.postAccessForbidden, HttpStatus.forbidden);
      }
    }

    const commentsResult = await this.commentService.getByPost(
      new GetCommentsByPostDto(
        post.id,
        commentsPage,
        commentsLimit,
        commentsSort
      ),
      viewerId,
      viewerRole
    );
    
    if (!commentsResult.success) {
      return ServiceResultFactory.fail<PostDetailsDto>(
        commentsResult.message ?? PostMessages.fetchDetailsFailed,
        commentsResult.status ?? HttpStatus.internalServerError
      );
    }
    const comments = commentsResult.data?.items ?? [];

    const data = await this.buildPostDetails(post, comments);

    return ServiceResultFactory.ok(PostMessages.detailsFetched, data,HttpStatus.ok);
  }

}
