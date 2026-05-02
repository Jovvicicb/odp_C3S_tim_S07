export class CommentLike {
  public constructor(
    public id: number = 0,
    public userId: number = 0,
    public commentId: number = 0,
    public likedAt: Date = new Date()
  ) {}
}