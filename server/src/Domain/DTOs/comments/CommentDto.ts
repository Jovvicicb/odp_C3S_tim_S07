export class CommentDto {
  public constructor(
    public id: number,
    public content: string,
    public userId: number,
    public postId: number,
    public parentId: number | null,
    public isDeleted: boolean,
    public isFlagged: boolean,
    public createdAt: Date
  ) {}
}