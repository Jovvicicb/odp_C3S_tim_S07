import { PostSortType } from "../../enums/posts/PostSortType";

export class GetPostsByCommunityDto {
  constructor(
      public communityId: number,
      public page: number,
      public limit: number,
      public sort: PostSortType = PostSortType.NEWEST
  ) {}
}