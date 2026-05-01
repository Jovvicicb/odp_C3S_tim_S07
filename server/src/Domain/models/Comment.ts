export class Comment {
  public constructor(
    public id: number = 0,
    public content: string = "",
    public userId: number = 0,
    public postId: number = 0,
    public parentId: number | null = null,
    public isDeleted: boolean = false,
    public isFlagged: boolean = false,
    public createdAt: Date = new Date()
  ) {}
}