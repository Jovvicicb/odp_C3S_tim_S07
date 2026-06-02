export class AdminStatisticsDto {
  constructor(
    public usersCount: number,
    public communitiesCount: number,
    public tagsCount: number,
  ) {}
}