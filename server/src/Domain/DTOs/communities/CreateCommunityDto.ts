import { CommunityType } from "../../enums/communities/CommunityType";

export class CreateCommunityDto {
  constructor(
    public name: string,
    public description: string | null,
    public rules: string | null,
    public type: CommunityType,
    public ownerId: number,
    public avatar: string | null
  ) {}
}
