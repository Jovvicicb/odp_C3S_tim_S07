import { RowDataPacket } from "mysql2";
import { CommunityDto } from "../../../Domain/DTOs/communities/CommunityDto";
import { CommunityType } from "../../../Domain/enums/communities/CommunityType";
import { Community } from "../../../Domain/models/Community";
import { CreateCommunityResponseDto } from "../../../Domain/DTOs/communities/CreateCommunityResponseDto";
import { CommunityMemberStatus } from "../../../Domain/enums/communities/CommunityMemberStatus";

export class CommunityMapper {
  public static toModel(row: RowDataPacket): Community {
    return new Community(
      Number(row.id),
      String(row.name),
      row.description === null ? null : String(row.description),
      row.rules === null ? null : String(row.rules),
      row.type as CommunityType,
      Number(row.owner_id),
      row.avatar === null ? null : String(row.avatar),
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
  public static toDto(
    community: Community,
    membershipStatus: CommunityMemberStatus | null = null,
    ownerUsername: string | null = null
  ): CommunityDto {
    return new CommunityDto(
      community.id,
      community.name,
      community.description,
      community.rules,
      community.type,
      community.ownerId,
      ownerUsername,
      community.avatar,
      community.createdAt,
      community.updatedAt,
      membershipStatus
    );
  }

  public static toCreateResponseDto(community: Community): CreateCommunityResponseDto {
    return new CreateCommunityResponseDto(
      community.id,
    );
  }

}