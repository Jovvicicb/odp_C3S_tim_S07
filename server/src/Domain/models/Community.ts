// TODO: Replace "Entity" and its fields with your domain model
import { CommunityType } from "../enums/CommunityType";

export class Community {
  constructor(
    public id: number = 0,
    public name: string = "",
    public description: string = "",
    public rules: string = "",
    public type: CommunityType = CommunityType.PUBLIC,
    public ownerId: number = 0,
    public avatar: string = "",
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
