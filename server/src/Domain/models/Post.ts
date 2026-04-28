export class Post {
  constructor(
    public id: number = 0,
    public title: string = "",
    public content: string = "",
    public mediaUrl: string | null = null,
    public authorId: number = 0,
    public communityId: number = 0,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
