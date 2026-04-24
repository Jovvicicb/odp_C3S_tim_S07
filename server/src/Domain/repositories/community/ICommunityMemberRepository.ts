import { CommunityMemberRole } from "../../DTOs/community/CommunityMemberRole";
import { CommunityMemberStatus } from "../../enums/communities/CommunityMemberStatus";
import { CommunityMember } from "../../models/CommunityMember";

export interface ICommunityMemberRepository {
    findCommunityIdsByUserId(page: number, limit: number, userId: number): Promise<{communityIds: number[]; total: number;}>;
    create(userId: number, communityId: number, role: CommunityMemberRole, status: CommunityMemberStatus): Promise<boolean>;
    delete(userId: number, communityId: number): Promise<boolean>;
    findByUserIdAndCommunityId(userId: number, communityId: number): Promise<CommunityMember>;
    exists(userId: number, communityId: number): Promise<boolean>;
}
