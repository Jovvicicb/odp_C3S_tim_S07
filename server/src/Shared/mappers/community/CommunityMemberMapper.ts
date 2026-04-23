import { RowDataPacket } from "mysql2";
import { CommunityMember } from "../../../Domain/models/CommunityMember";
import { CommunityMemberRole } from "../../../Domain/DTOs/community/CommunityMemberRole";
import { CommunityMemberStatus } from "../../../Domain/enums/communities/CommunityMemberStatus";

export class CommunityMemberMapper {
  public static toModel(row: RowDataPacket): CommunityMember {
    return new CommunityMember(
      row.id,
      row.user_id,
      row.community_id,
      row.role as CommunityMemberRole,
      row.status as CommunityMemberStatus,
      row.joined_at
    );
  }
}