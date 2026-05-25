export class StatisticsDto {
  constructor(
    public joinedCommunitiesCount: number = 0,
    public postsCount: number = 0,
    public followersCount: number = 0,
    public followingCount: number = 0,
  ) {}
}