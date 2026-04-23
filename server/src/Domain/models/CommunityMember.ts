import { CommunityMemberRole } from "../DTOs/community/CommunityMemberRole";
import { CommunityMemberStatus } from "../enums/communities/CommunityMemberStatus";

export class CommunityMember {
    constructor(
        public id: number = 0,
        public userId: number = 0,
        public communityId: number = 0,
        public role: CommunityMemberRole = CommunityMemberRole.MEMBER,
        public status: CommunityMemberStatus = CommunityMemberStatus.ACTIVE,
        public joinedAt?: Date
    ){}
}