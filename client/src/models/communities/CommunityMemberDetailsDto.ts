import type { UserDto } from "../users/UserDto";
import type { CommunityMemberStatus } from "../../types/communities/CommunityMemberStatus";
import type { CommunityMemberRole } from "../../types/communities/CommunityMemberRole";

export type CommunityMemberDetailsDto = {
  user: UserDto;
  communityRole: CommunityMemberRole;
  communityStatus: CommunityMemberStatus;
  isOwner: boolean;
};