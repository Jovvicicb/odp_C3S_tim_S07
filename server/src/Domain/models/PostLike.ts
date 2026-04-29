export class PostLike {
  constructor(
    public id: number = 0,
    public userId: number = 0,
    public postId: number = 0,
    public likedAt: Date = new Date()
  ) {}
}
