import { CommunityType } from "../../enums/communities/CommunityType";

export class CommunityDto {
  constructor(
    public id: number,
    public name: string,
    public description: string | null,
    public rules: string | null,
    public type: CommunityType,
    public ownerId: number,
    public avatar: string | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
