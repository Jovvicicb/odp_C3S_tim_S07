import { CommunityMemberRole } from "../../enums/communities/CommunityMemberRole";
import { CommunityMemberStatus } from "../../enums/communities/CommunityMemberStatus";
import { UserDto } from "../users/UserDto";

export class CommunityMemberDetailsDto {
  constructor(
    public user: UserDto,
    public communityRole: CommunityMemberRole,
    public communityStatus: CommunityMemberStatus,
    public isOwner: boolean
  ) {}
}