import { CommunityMemberRole } from "../../enums/communities/CommunityMemberRole";
import { CommunityMemberStatus } from "../../enums/communities/CommunityMemberStatus";
import { CommunityMember } from "../../models/CommunityMember";

export interface ICommunityMemberRepository {
    findCommunityIdsByUserId(page: number, limit: number, userId: number): Promise<{communityIds: number[]; total: number}>;
    findUserIdsByCommunityId(page: number, limit: number, communityId: number): Promise<{ usersIds: number[]; total: number}>;
    create(userId: number, communityId: number, role: CommunityMemberRole, status: CommunityMemberStatus): Promise<boolean>;
    updateRole(userId: number, communityId: number, role: CommunityMemberRole): Promise<boolean>;
    delete(userId: number, communityId: number): Promise<boolean>;
    findByUserIdAndCommunityId(userId: number, communityId: number): Promise<CommunityMember>;
    exists(userId: number, communityId: number): Promise<boolean>;
}
