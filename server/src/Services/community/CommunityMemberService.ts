import { CommunityMessages } from '../../Domain/constants/messages/community/CommunityMessages';
import { HttpStatus } from "../../Domain/constants/statusCode/HttpStatus";
import { PaginatedListDto } from '../../Domain/DTOs/common/PaginatedListDto';
import { CommunityDto } from '../../Domain/DTOs/community/CommunityDto';
import { CommunityMemberStatus } from "../../Domain/enums/communities/CommunityMemberStatus";
import { CommunityType } from "../../Domain/enums/communities/CommunityType";
import { ICommunityMemberRepository } from "../../Domain/repositories/community/ICommunityMemberRepository";
import { ICommunityRepository } from "../../Domain/repositories/community/ICommunityRepository";
import { ICommunityMemberService } from "../../Domain/services/community/ICommunityMemberService";
import { ServiceResult } from "../../Domain/types/service/ServiceResult";
import { ServiceResultFactory } from "../../Domain/types/service/ServiceResultFactory";
import { CommunityMapper } from '../../Shared/mappers/community/CommunityMapper';

export class CommunityMemberService implements ICommunityMemberService {
  public constructor(
     private readonly communityMemberRepo: ICommunityMemberRepository,
     private readonly communityRepo: ICommunityRepository,
  ) {}

  

  async join(communityId: number, userId: number): Promise<ServiceResult> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0){
        return ServiceResultFactory.fail(
            CommunityMessages.notFound,
            HttpStatus.notFound
        );
    } 

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(userId, communityId);

    if (membership.id !== 0) {
        if (membership.status === CommunityMemberStatus.ACTIVE) {
        return ServiceResultFactory.fail(
            CommunityMessages.alreadyMember,
            HttpStatus.conflict
        );
        }

        if (membership.status === CommunityMemberStatus.PENDING) {
        return ServiceResultFactory.fail(
            CommunityMessages.requestAlreadySent,
            HttpStatus.conflict
        );
        }

        if (membership.status === CommunityMemberStatus.BANNED) {
        return ServiceResultFactory.fail(
            CommunityMessages.bannedFromCommunity,
            HttpStatus.forbidden
        );
        }
    }
    
    const status = community.type === CommunityType.PUBLIC
            ? CommunityMemberStatus.ACTIVE
            : CommunityMemberStatus.PENDING;

    const created = await this.communityMemberRepo.create(userId, communityId, status);
    if (!created) {
        return ServiceResultFactory.fail(
        CommunityMessages.joinFailed,
        HttpStatus.internalServerError
        );
    }
    return ServiceResultFactory.ok(
        status === CommunityMemberStatus.ACTIVE
            ? CommunityMessages.joined
            : CommunityMessages.requestSent,
        undefined,
        HttpStatus.ok
    );
  }

  async leave(communityId: number, userId: number): Promise<ServiceResult> {
    const community = await this.communityRepo.findById(communityId);
    if (community.id === 0){
        return ServiceResultFactory.fail(
            CommunityMessages.notFound,
            HttpStatus.notFound
        );
    } 

    if (community.ownerId === userId){
        return ServiceResultFactory.fail(
            CommunityMessages.ownerCannotLeave,
            HttpStatus.badRequest
        );
    } 

    const membership = await this.communityMemberRepo.findByUserIdAndCommunityId(userId, communityId);

    if (membership.id === 0) {
        return ServiceResultFactory.fail(
            CommunityMessages.notMember,
            HttpStatus.notFound
        );
    }

    if (membership.status === CommunityMemberStatus.BANNED) {
        return ServiceResultFactory.fail(
            CommunityMessages.notMember,
            HttpStatus.notFound
        );
    }
    
    const deleted = await this.communityMemberRepo.delete(userId, communityId);
    if (!deleted) {
        return ServiceResultFactory.fail(
        CommunityMessages.leaveFailed,
        HttpStatus.internalServerError
        );
    }
    return ServiceResultFactory.ok(
        membership.status === CommunityMemberStatus.PENDING
            ? CommunityMessages.requestCancelled
            : CommunityMessages.left,
        undefined,
        HttpStatus.ok
    );
  }
  
  async getMine(page: number, limit: number, userId: number): Promise<ServiceResult<PaginatedListDto<CommunityDto>>> {
      const result = await this.communityMemberRepo.findCommunityIdsByUserId(page,limit,userId);

      const communities =await this.communityRepo.findByIds(result.communityIds);

      const data = new PaginatedListDto(
        communities.map((c) => CommunityMapper.toDto(c)),
        result.total,
        page,
        limit
    );

    return ServiceResultFactory.ok(
        CommunityMessages.fetchMineSuccess,
        data,
        HttpStatus.ok
    );
  }

}
