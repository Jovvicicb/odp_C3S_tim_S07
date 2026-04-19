import { RowDataPacket } from "mysql2";
import { CommunityDto } from "../../../Domain/DTOs/community/CommunityDto";
import { CommunityType } from "../../../Domain/enums/CommunityType";
import { Community } from "../../../Domain/models/Community";
import { CreateCommunityResponseDto } from "../../../Domain/DTOs/community/CreateCommunityResponseDto";

export class CommunityMapper {
  public static toDtoFromRow(row: RowDataPacket): CommunityDto {
    return new CommunityDto(
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

   public static toDtoFromModel(community: Community): CreateCommunityResponseDto {
    return new CreateCommunityResponseDto(
      community.id,
    );
  }

}