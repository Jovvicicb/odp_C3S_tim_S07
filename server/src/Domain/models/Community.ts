import { CommunityType } from "../enums/communities/CommunityType";

export class Community {
  constructor(
    public id: number = 0,
    public name: string = "",
    public description: string = "",
    public rules: string = "",
    public type: CommunityType = CommunityType.PUBLIC,
    public ownerId: number = 0,
    public avatar: string = "",
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}