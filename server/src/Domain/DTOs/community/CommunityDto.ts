// TODO: Replace with your domain-specific DTO fields
import { CommunityType } from "../../enums/communities/CommunityType";

export class CommunityDto {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public rules: string,
    public type: CommunityType,
    public ownerId: number,
    public avatar: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
