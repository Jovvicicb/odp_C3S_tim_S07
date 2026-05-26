export class GetPostsByUserDto {
  public constructor(
    public userId: number,
    public page: number,
    public limit: number,
  ) {}
}