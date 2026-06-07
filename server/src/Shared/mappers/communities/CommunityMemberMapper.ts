import { RowDataPacket } from "mysql2";
import { CommunityMember } from "../../../Domain/models/CommunityMember";
import { CommunityMemberRole } from "../../../Domain/enums/communities/CommunityMemberRole";
import { CommunityMemberStatus } from "../../../Domain/enums/communities/CommunityMemberStatus";

export class CommunityMemberMapper {
  public static toModel(row: RowDataPacket): CommunityMember {
    return new CommunityMember(
      Number(row.id),
      Number(row.user_id),
      Number(row.community_id),
      row.role as CommunityMemberRole,
      row.status as CommunityMemberStatus,
      new Date(row.joined_at)
    );
  }
}