import type { UserDto } from "../user/UserDto";
import type { CommunityMemberStatus } from "../../types/community/CommunityMemberStatus";
import type { CommunityMemberRole } from "../../types/community/CommunityMemberRole";

export type CommunityMemberDetailsDto = {
  user: UserDto;
  communityRole: CommunityMemberRole;
  communityStatus: CommunityMemberStatus;
  isOwner: boolean;
};