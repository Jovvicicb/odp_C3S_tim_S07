import { CommunityType } from "../../enums/CommunityType";

export class CreateCommunityDto {
  constructor(
    public name: string,
    public description: string,
    public rules: string,
    public type: CommunityType,
    public ownerId: number,
    public avatar: string
  ) {}
}
