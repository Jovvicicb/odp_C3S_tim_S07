import { RowDataPacket } from "mysql2";
import { Tag } from "../../../Domain/models/Tag";
import { TagDto } from "../../../Domain/DTOs/tags/TagDto";

export class TagMapper {
  public static toModel(row: RowDataPacket): Tag {
    return new Tag(
      row.id,
      row.name,
      new Date(row.created_at)
    );
  }

  public static toDto(tag: Tag): TagDto {
    return new TagDto(
      tag.id,
      tag.name,
      tag.createdAt
    );
  }
}