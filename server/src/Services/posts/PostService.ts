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
import { PostViewerPermissionsDto } from "../../Domain/DTOs/Posts/PostViewerPermissionsDto";
import { PostWithDetailsDto } from "../../Domain/DTOs/Posts/PostWithDetailsDto";
import { UpdatePostDto } from "../../Domain/DTOs/Posts/UpdatePostDto";
import { PostTagDto } from "../../Domain/DTOs/tags/PostTagDto";
import { CommentSortType } from "../../Domain/enums/comments/CommentSortType";
import { CommunityMemberRole } from "../../Domain/enums/communities/CommunityMemberRole";
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { CommunityType } from "../../Domain/enums/communities/CommunityType";
import { UserRole } from "../../Domain/enums/users/UserRole";
import { Community } from "../../Domain/models/Community";
import { CommunityMember } from "../../Domain/models/CommunityMember";
import { Post } from "../../Domain/models/Post";
import { User } from "../../Domain/models/User";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { IPostCommentRepository } from "../../Domain/repositories/posts/IPostCommentRepository";
import { IPostLikeRepository } from "../../Domain/repositories/posts/IPostLikeRepository";
import { IPostRepository } from "../../Domain/repositories/posts/IPostRepository";
import { IPostTagRepository } from "../../Domain/repositories/posts/IPostTagRepository";
import { ITagRepository } from "../../Domain/repositories/tags/ITagRepository";
import { IUserFollowRepository } from "../../Domain/repositories/users/IUserFollowRepository";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { ICommentService } from "../../Domain/services/comments/ICommentService";
import { IAuditHelperService } from "../../Domain/services/common/IAuditHelperService";
import { IPostService } from "../../Domain/services/posts/IPostService";
import { AuditContext } from "../../Domain/types/audits/AuditContext";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { CommunityMapper } from "../../Shared/mappers/community/CommunityMapper";
import { PostMapper } from "../../Shared/mappers/posts/PostMapper";
import { UserMapper } from "../../Shared/mappers/users/UserMapper";


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
    private readonly userRepo: IUserRepository,
    private readonly commentService: ICommentService,
    private readonly auditHelperService: IAuditHelperService
  ) {}

  private isActiveModerator(membership?: CommunityMember): boolean {
    return (
      !!membership &&
      membership.id !== 0 &&
      membership.role === CommunityMemberRole.MODERATOR &&
      membership.status === CommunityMemberStatus.ACTIVE
    );
  }

  private canManagePost(post: Post, requesterId: number, requesterRole: UserRole | undefined, membership?: CommunityMember): boolean {
    const isAuthor = post.authorId === requesterId;
    const isAdmin = requesterRole === UserRole.ADMIN;
    const isModerator = this.isActiveModerator(membership);

    if (isAdmin) {
      return true;
    }

    if (
      membership &&
      membership.id !== 0 &&
      (
        membership.status === CommunityMemberStatus.BANNED ||
        membership.status === CommunityMemberStatus.PENDING
      )
    ) {
      return false;
    }

    return isAuthor || isModerator;
  }

  private buildPostPermissions(post: Post, viewerId: number | undefined, canViewContent: boolean, isModerator: boolean): PostViewerPermissionsDto {
    const isAuthor = viewerId !== undefined && post.authorId === viewerId;
    const canInteract = !!viewerId && canViewContent;

    return new PostViewerPermissionsDto(
      canInteract && (isAuthor || isModerator),
      canInteract && (isAuthor || isModerator),
      canInteract && (isAuthor || isModerator),
      canInteract,
      canInteract,
      canInteract && isModerator
    );
  }

  private async buildPostsWithDetails(posts: Post[]): Promise<PostWithDetailsDto[]> {
    if (posts.length === 0) return [];

    const postIds = posts.map((post) => post.id);

    const tagIdsByPostId = await this.postTagRepo.findTagIdsByPostIds(postIds);
    const uniqueTagIds = Array.from(new Set(Object.values(tagIdsByPostId).flat()));
    const tags = uniqueTagIds.length > 0
      ? await this.tagRepo.findByIds(uniqueTagIds)
      : [];

    const tagsById = tags.reduce<Record<number, PostTagDto>>((acc, tag) => {
        acc[tag.id] = new PostTagDto(tag.id, tag.name);
        return acc;
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

  private async buildPostDetails(post: Post, community: Community, author: User, comments: PaginatedListDto<CommentTreeDto>, likedByCurrentUser: boolean, permissions: PostViewerPermissionsDto, membershipStatus: CommunityMemberStatus | null): Promise<PostDetailsDto> {
    const tagIdsByPostId = await this.postTagRepo.findTagIdsByPostIds([post.id]);
    const tagIds = tagIdsByPostId[post.id] ?? [];

    const tags = tagIds.length > 0
      ? await this.tagRepo.findByIds(tagIds)
      : [];

    const postTags = tags.map((tag) => new PostTagDto(tag.id, tag.name));

    const likeCounts = await this.postLikeRepo.countByPostIds([post.id]);
    const commentCounts = await this.postCommentRepo.countByPostIds([post.id]);

    const authorDto = author.id !== 0 ? UserMapper.toDto(author) : null;
    const communityDto = CommunityMapper.toDto(community, membershipStatus);

    return PostMapper.toDetailsDto(
      post,
      authorDto,
      communityDto,
      postTags,
      likeCounts[post.id] ?? 0,
      commentCounts[post.id] ?? 0,
      likedByCurrentUser,
      permissions,
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

  async update(id: number, dto: UpdatePostDto, ctx: AuditContext, requesterRole?: UserRole): Promise<ServiceResult> {
    const post = await this.postRepo.findById(id);
    if(post.id === 0){
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }
  
    const requesterId = ctx.userId;

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(requesterId, post.communityId);

    const canManage = this.canManagePost(post, requesterId, requesterRole, membership);
    if (!canManage) {
      return ServiceResultFactory.fail(PostMessages.onlyAuthorOrModeratorCanUpdate, HttpStatus.forbidden);
    }

    const updated = await this.postRepo.update(id,dto);
    if (!updated) {
      return ServiceResultFactory.fail(PostMessages.updateFailed, HttpStatus.internalServerError);
    }

    await this.auditHelperService.safeCreate(new CreateAuditDto(ctx.userId, AuditActions.POST_UPDATED, AuditDetails.POST_UPDATED, ctx.ipAddress));

    return ServiceResultFactory.ok(PostMessages.updated, undefined, HttpStatus.ok);
  }


  async delete(id: number, ctx: AuditContext,  requesterRole?: UserRole): Promise<ServiceResult> {
    const post = await this.postRepo.findById(id);
    if(post.id === 0){
      return ServiceResultFactory.fail(PostMessages.notFound, HttpStatus.notFound);
    }

    const requesterId = ctx.userId;
  
    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(requesterId, post.communityId);
   
    const canManage = this.canManagePost(post,  requesterId,  requesterRole, membership);

    if (!canManage) {
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
    if (result.posts.length === 0) {
      const data = new PaginatedListDto([], result.total, dto.page, dto.limit);
      return ServiceResultFactory.ok(PostMessages.postsFetched, data, HttpStatus.ok);
    }

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
    if (result.posts.length === 0) {
      const data = new PaginatedListDto([], result.total, page, limit);
      return ServiceResultFactory.ok(PostMessages.feedFetched, data, HttpStatus.ok);
    }

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

    const membershipStatus =
      membership && membership.id !== 0
        ? membership.status
        : null;

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
        return ServiceResultFactory.fail<PostDetailsDto>(
          PostMessages.postAccessForbidden,
          HttpStatus.forbidden
        );
      }
    }

    const canViewContent =
      community.type === CommunityType.PUBLIC ||
      isAdmin ||
      membershipStatus === CommunityMemberStatus.ACTIVE;

    const isModerator = isAdmin || this.isActiveModerator(membership);

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

    if (!commentsResult.success || !commentsResult.data) {
      return ServiceResultFactory.fail<PostDetailsDto>(
        commentsResult.message ?? PostMessages.fetchDetailsFailed,
        commentsResult.status ?? HttpStatus.internalServerError
      );
    }

    const likedByCurrentUser = viewerId
      ? await this.postLikeRepo.exists(viewerId, post.id)
      : false;

    const permissions = this.buildPostPermissions(
      post,
      viewerId,
      canViewContent,
      isModerator
    );

    const author = await this.userRepo.findById(post.authorId);

    const data = await this.buildPostDetails(
      post,
      community,
      author,
      commentsResult.data,
      likedByCurrentUser,
      permissions,
      membershipStatus
    );

    return ServiceResultFactory.ok(PostMessages.detailsFetched, data, HttpStatus.ok);
  }

}
