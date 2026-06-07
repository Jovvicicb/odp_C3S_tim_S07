import { CommunityDiscoverType } from "../../enums/communities/CommunityDiscoverType";
import { CommunityType } from "../../enums/communities/CommunityType";

export class DiscoverCommunitiesDto {
  constructor(
    public page: number,
    public limit: number,
    public type: CommunityType | null,
    public search: string | null
  ) {}
}