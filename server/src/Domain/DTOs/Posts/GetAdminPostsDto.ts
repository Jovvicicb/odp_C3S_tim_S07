export class GetAdminPostsDto {
  public constructor(
    public page: number,
    public limit: number,
  ) {}
}