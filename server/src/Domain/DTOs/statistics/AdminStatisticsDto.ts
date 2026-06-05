export class AdminStatisticsDto {
  constructor(
    public usersCount: number,
    public communitiesCount: number,
    public postsCount: number,
    public tagsCount: number,
  ) {}
}