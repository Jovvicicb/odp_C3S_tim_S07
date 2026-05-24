import type { UserDto } from "../users/UserDto";
import type { CommunityMemberStatus } from "../../types/communities/members/CommunityMemberStatus";
import type { CommunityMemberRole } from "../../types/communities/members/CommunityMemberRole";

export type CommunityMemberDetailsDto = {
  user: UserDto;
  communityRole: CommunityMemberRole;
  communityStatus: CommunityMemberStatus;
  isOwner: boolean;
};