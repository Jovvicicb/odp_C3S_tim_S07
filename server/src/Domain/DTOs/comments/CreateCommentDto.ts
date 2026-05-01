export class CreateCommentDto {
  public constructor(
    public content: string,
    public userId: number,
    public postId: number,
    public parentId: number | null
  ) {}
}