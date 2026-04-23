import { CommunityMemberStatus } from "../../enums/communities/CommunityMemberStatus";
import { CommunityMember } from "../../models/CommunityMember";

export interface ICommunityMemberRepository {
    create(userId: number, communityId: number, status: CommunityMemberStatus): Promise<boolean>;
    findByUserIdAndCommunityId(userId: number, communityId: number): Promise<CommunityMember>;
    exists(userId: number, communityId: number): Promise<boolean>;
}
 