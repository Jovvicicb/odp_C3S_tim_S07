import { PostTagDto } from "../tags/PostTagDto";

export class PostWithDetailsDto {
  public constructor(
    public id: number,
    public title: string,
    public content: string,
    public mediaUrl: string | null,
    public authorId: number,
    public authorUsername: string | null,
    public communityId: number,
    public createdAt: Date,
    public updatedAt: Date | null,
    public tags: PostTagDto[],
    public likeCount: number,
    public commentCount: number
  ) {}
}