import { RowDataPacket } from "mysql2";
import { CommunityDto } from "../../../Domain/DTOs/community/CommunityDto";
import { CommunityType } from "../../../Domain/enums/communities/CommunityType";
import { Community } from "../../../Domain/models/Community";
import { CreateCommunityResponseDto } from "../../../Domain/DTOs/community/CreateCommunityResponseDto";

export class CommunityMapper {
  public static toModel(row: RowDataPacket): Community {
    return new Community(
      row.id,
      row.name,
      row.description,
      row.rules,
      row.type as CommunityType,
      row.owner_id,
      row.avatar,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
  public static toDto(community: Community): CommunityDto {
    return new CommunityDto(
      community.id,
      community.name,
      community.description,
      community.rules,
      community.type,
      community.ownerId,
      community.avatar,
      community.createdAt,
      community.updatedAt
    );
  }

   public static toCreateResponseDto(community: Community): CreateCommunityResponseDto {
    return new CreateCommunityResponseDto(
      community.id,
    );
  }

}