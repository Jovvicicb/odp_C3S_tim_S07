import { AuditActions } from "../../Domain/constants/messages/audits/AuditActions";
import { AuditDetails } from "../../Domain/constants/messages/audits/AuditDetails";
import { PostMessages } from "../../Domain/constants/messages/posts/PostMessages";
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { CreateAuditDto } from "../../Domain/DTOs/audits/CreateAuditDto";
import { CreatePostDto } from "../../Domain/DTOs/Posts/CreatePostDto";
import { PostDto } from "../../Domain/DTOs/Posts/PostDto";
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { IPostRepository } from "../../Domain/repositories/posts/IPostRepository";
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
    private readonly auditHelperService: IAuditHelperService
  ) {}

  
  async create(dto: CreatePostDto,ctx: AuditContext): Promise<ServiceResult<PostDto>> {
    const community = await this.communityRepo.findById(dto.communityId);
    if (community.id === 0) {
      return ServiceResultFactory.fail<PostDto>(PostMessages.communityNotFound,  HttpStatus.notFound);
    }

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(dto.authorId, dto.communityId);
    if (membership.id === 0 || membership.status !== CommunityMemberStatus.ACTIVE) {
        return ServiceResultFactory.fail<PostDto>(PostMessages.notMember, HttpStatus.forbidden);
    }

    const created = await this.postRepo.create(dto);
    if (!created) {
      return ServiceResultFactory.fail<PostDto>(PostMessages.createFailed, HttpStatus.internalServerError);
    }
    
    await this.auditHelperService.safeCreate( new CreateAuditDto(ctx.userId, AuditActions.POST_CREATED, AuditDetails.POST_CREATED, ctx.ipAddress));

    const postDto = PostMapper.toDto(created);
    return ServiceResultFactory.ok(PostMessages.created, postDto, HttpStatus.created);
  }

}
